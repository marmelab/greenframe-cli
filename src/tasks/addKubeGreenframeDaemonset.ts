import { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import { GREENFRAME_NAMESPACE } from '../constants';
import { kubeClient } from '../services/container/kubernetes/client';

const greenframeDaemonset = {
    apiVersion: 'apps/v1',
    kind: 'DaemonSet',
    metadata: {
        annotations: {
            'seccomp.security.alpha.kubernetes.io/pod': 'docker/default',
        },
        labels: {
            app: 'cadvisor',
        },
        name: 'cadvisor',
        namespace: GREENFRAME_NAMESPACE,
    },
    spec: {
        selector: {
            matchLabels: {
                app: 'cadvisor',
                name: 'cadvisor',
            },
        },
        template: {
            metadata: {
                labels: {
                    app: 'cadvisor',
                    name: 'cadvisor',
                },
            },
            spec: {
                automountServiceAccountToken: false,
                containers: [
                    {
                        args: [
                            '--housekeeping_interval=500ms',
                            '--global_housekeeping_interval=500ms',
                            '--allow_dynamic_housekeeping=false',
                            '--disable_metrics=accelerator,advtcp,cpu_topology,cpuset,hugetlb,memory_numa,percpu,process,referenced_memory,resctrl,sched,tcp,udp',
                        ],
                        image: 'gcr.io/cadvisor/cadvisor:v0.39.3',
                        name: 'cadvisor',
                        ports: [
                            {
                                containerPort: 8080,
                                name: 'http',
                                protocol: 'TCP',
                            },
                        ],
                        resources: {
                            limits: {
                                cpu: '900m',
                                memory: '2Gi',
                            },
                            requests: {
                                cpu: '400m',
                                memory: '400Mi',
                            },
                        },
                        volumeMounts: [
                            {
                                mountPath: '/rootfs',
                                name: 'rootfs',
                                readOnly: true,
                            },
                            {
                                mountPath: '/var/run',
                                name: 'var-run',
                                readOnly: true,
                            },
                            {
                                mountPath: '/sys',
                                name: 'sys',
                                readOnly: true,
                            },
                            {
                                mountPath: '/var/lib/docker',
                                name: 'docker',
                                readOnly: true,
                            },
                            {
                                mountPath: '/dev/disk',
                                name: 'disk',
                                readOnly: true,
                            },
                            {
                                name: 'containerd',
                                mountPath: '/var/run/containerd/containerd.sock',
                                readOnly: true,
                            },
                        ],
                    },
                ],
                terminationGracePeriodSeconds: 30,
                volumes: [
                    {
                        hostPath: {
                            path: '/',
                        },
                        name: 'rootfs',
                    },
                    {
                        hostPath: {
                            path: '/var/run',
                        },
                        name: 'var-run',
                    },
                    {
                        hostPath: {
                            path: '/sys',
                        },
                        name: 'sys',
                    },
                    {
                        hostPath: {
                            path: '/var/lib/docker',
                        },
                        name: 'docker',
                    },
                    {
                        hostPath: {
                            path: '/dev/disk',
                        },
                        name: 'disk',
                    },
                    {
                        hostPath: {
                            path:
                                process.env.CONTAINERD_SOCK ||
                                '/var/run/containerd/containerd.sock',
                        },
                        name: 'containerd',
                    },
                ],
            },
        },
    },
};

export const addKubeGreenframeDaemonset = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: TaskWrapper<unknown, any>
) => {
    const { body } = await kubeClient.list('apps/v1', 'DaemonSet', GREENFRAME_NAMESPACE);
    if (body.items.some((item) => item.metadata?.name === 'cadvisor')) {
        task.title = 'Greenframe daemonset already exists';
        return;
    }

    await kubeClient.create(greenframeDaemonset);
};
