import { Writable } from 'node:stream';
import { GREENFRAME_NAMESPACE } from '../../../constants';
import { exec } from './client';
import { getPodsByLabel } from './pods';
import type { CadvisorContainerStats } from './stats';

const CADVISOR_LABEL = 'app=cadvisor';

export const getCadvisorPodNames = async () => {
    const pods = await getPodsByLabel(CADVISOR_LABEL, GREENFRAME_NAMESPACE);
    return pods
        .filter((item) => item.metadata)
        .map((item) => item.metadata?.name as string);
};

export const getCadvisorPods = async () => {
    const pods = await getPodsByLabel(CADVISOR_LABEL, GREENFRAME_NAMESPACE);
    if (pods.length === 0) {
        throw new Error(
            'Cannot find cadvisor pods, please make sure you have deployed cadvisor from greenframe.\n' +
                'You can deploy cadvisor by running "greenframe kube-config"'
        );
    }

    return pods;
};

export const getCadvisorMetrics = (
    cadvisorPodName: string,
    podName: string
): Promise<CadvisorContainerStats> => {
    const stdoutStream = new Writable();
    const stdoutChunks: Uint8Array[] = [];
    stdoutStream._write = (chunk, encoding, callback) => {
        stdoutChunks.push(chunk);
        callback();
    };

    return new Promise<CadvisorContainerStats>((resolve, reject) => {
        exec.exec(
            GREENFRAME_NAMESPACE,
            cadvisorPodName,
            'cadvisor',
            ['wget', '-O', '-', `localhost:8080/api/v1.0/containers/${podName}`],
            stdoutStream,
            null,
            null,
            false,
            (status) => {
                if (status.status !== 'Success') {
                    reject(status);
                } else {
                    const str = Buffer.concat(stdoutChunks).toString('utf8');
                    resolve(JSON.parse(str));
                }
            }
        ).catch((error) => {
            console.error(error);
            reject(error);
        });
    });
};
