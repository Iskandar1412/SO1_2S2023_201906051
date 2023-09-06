#include <linux/fs.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/seq_file.h>
#include <linux/cred.h>

#define FileProc "cpu_201906051"

MODULE_AUTHOR("Juan Urbina");
MODULE_DESCRIPTION("Modulo CPU");
MODULE_LICENSE("GPL");

struct task_struct *task;
const struct cred *cred;
char state;
unsigned long total_time, idle_time, usage;
unsigned long user, nice, system, idle, iowait, irq, softirq, steal;

static int show_cpu_stat(struct seq_file *f, void *v){
    seq_printf(f,"{\n");
    seq_printf(f,"\"Current_user\": %u,\n", current_uid().val);

    for_each_process(task) {
        cred = get_task_cred(task);
        state = task_state_to_char(task);

        seq_printf(f,"\"Process\": \"%s\", \"PID\": %d, \"UID\": %u, \"State\": \"%c\",\n",
               task->comm, task->pid, cred->uid.val, state);

        put_cred(cred);
    }

    char buf[256];
    struct file *file;
    file = filp_open("/proc/stat", O_RDONLY, 0);
    if (file) {
        kernel_read(file, buf, sizeof(buf), &file->f_pos);
        filp_close(file, NULL);
        sscanf(buf, "cpu %lu %lu %lu %lu %lu %lu %lu %lu", &user, &nice,
               &system, &idle, &iowait, &irq, &softirq, &steal);
        total_time = user + nice + system + idle + iowait + irq + softirq + steal;
        idle_time = idle + iowait;
        usage = 100 * (total_time - idle_time) / total_time;
    }

    seq_printf(f,"\"CPU_usage\": %lu,\n", usage);
    seq_printf(f,"}\n");
    return 0;
}

static int cpuinfo_proc_open(struct inode *inode, struct file*file){
    return single_open(file,show_cpu_stat, NULL);
}

static const struct proc_ops Cpuinfo_fops = {
    .proc_open = cpuinfo_proc_open,
    .proc_read = seq_read,
    .proc_lseek  = seq_lseek,
	.proc_release = single_release
};

static int __init cpu_module_init(void)
{
    printk(KERN_INFO "CPU module loaded.\n");
    proc_create (FileProc, 0777, NULL, &Cpuinfo_fops);
	printk(KERN_INFO "Archivo Creado: /proc/%s\n",FileProc);
	return 0;
}

static void __exit cpu_module_exit(void)
{
    printk(KERN_INFO "CPU module unloaded.\n");
	remove_proc_entry(FileProc, NULL);
}

module_init(cpu_module_init);
module_exit(cpu_module_exit);