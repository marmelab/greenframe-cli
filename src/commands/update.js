const axios = require('axios');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const { Command } = require('@oclif/core');
class UpdateCommand extends Command {
    static args = [
        {
            name: 'channel',
            description: 'Release channel',
            default: 'stable',
        },
    ];

    async run() {
        try {
            const { args } = await this.parse(UpdateCommand);
            const { version, platform, arch, bin } = this.config;
            const manifestUrl = this.config.s3Url(
                `channels/${args.channel}/${bin}-${platform}-${arch}-buildmanifest`
            );

            const { data } = await axios.get(manifestUrl).catch(() => {
                throw new Error(
                    'Channel release was not found try with: greenframe update'
                );
            });

            if (data.version === version) {
                console.log(`${bin}-${version} ${platform}-${arch}`);
                console.log(`✅ Already up to date`);
                process.exit(0);
            }

            console.log(`Updating to ${data.version}...`);
            const { stderr } = await exec(
                `cd $HOME/.local/lib &&
                    rm -rf greenframe &&
                    rm -rf ~/.local/share/greenframe/client &&
                    curl -s ${data.gz} | tar xz &&
                    rm -f $(command -v greenframe) || true &&
                    rm -f $HOME/.local/bin/greenframe &&
                    ln -s $HOME/.local/lib/greenframe/bin/greenframe $HOME/.local/bin/greenframe
                `,
                { shell: true }
            );
            if (stderr) {
                throw new Error(stderr);
            }

            console.log(`✅ Done !`);
        } catch (error) {
            console.error('\n❌ Update failed!');
            console.error(error.message);
            process.exit(1);
        }
    }
}

UpdateCommand.description = `Update GreenFrame to the latest version
...
greenframe update
`;

module.exports = UpdateCommand;
