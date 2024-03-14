import { Args, Command } from '@oclif/core';
import axios from 'axios';
import { exec as execSync } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execSync);

class UpdateCommand extends Command {
    static args = {
        channel: Args.string({
            name: 'channel',
            description: 'Release channel',
            default: 'stable',
        }),
    };

    async run() {
        try {
            const { args } = await this.parse(UpdateCommand);
            const { version, platform, arch, bin } = this.config;
            const manifestUrl = this.config.s3Url(
                `channels/${args.channel}/${bin}-${platform}-${arch}-buildmanifest`
            );

            const { data } = await axios
                .get<{ version: string; gz: string }>(manifestUrl)
                .catch(() => {
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
                { shell: 'sh' }
            );
            if (stderr) {
                throw new Error(stderr);
            }

            console.log(`✅ Done !`);
        } catch (error) {
            console.error('\n❌ Update failed!');
            if (error instanceof Error) {
                console.error(error.message);
            }

            process.exit(1);
        }
    }
}

UpdateCommand.description = `Update GreenFrame to the latest version
...
greenframe update
`;

export default UpdateCommand;
