#include <linux/fs.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/seq_file.h>
#include <linux/cred.h>
#include <linux/mm.h> 
#include <linux/utsname.h>
#include <linux/proc_fs.h>

#define FileProc "cpu_201906051"

MODULE_AUTHOR("Juan Urbina");
MODULE_DESCRIPTION("Modulo CPU");
MODULE_LICENSE("GPL");

struct task_struct *task;
const struct cred *cred;
char state;
unsigned long usage;
unsigned long user, nice, system, idle, iowait, irq, softirq, steal;
unsigned long vsize, rss;

// Función para calcular el uso de CPU
static unsigned long calculate_cpu_usage(void) {
    char buf[256];
    struct file *file;
    unsigned long total_time, idle_time;

    file = filp_open("/proc/stat", O_RDONLY, 0);
    if (!file)
        return 0;

    kernel_read(file, buf, sizeof(buf), &file->f_pos);
    filp_close(file, NULL);

    sscanf(buf, "cpu %lu %lu %lu %lu %lu %lu %lu %lu", &user, &nice,
           &system, &idle, &iowait, &irq, &softirq, &steal);
    
    total_time = user + nice + system + idle + iowait + irq + softirq + steal;
    idle_time = idle + iowait;

    return 100 * (total_time - idle_time) / total_time;
}

static int show_cpu_stat(struct seq_file *f, void *v) {
    struct new_utsname *utsname;
    utsname = init_utsname();

    seq_printf(f, "{\n");
    seq_printf(f, "\t\"Nombre_equipo\": \"%s\",\n", utsname->nodename);
    usage = calculate_cpu_usage();  // Calcular el uso de CPU
    seq_printf(f, "\t\"Uso_de_CPU\": %lu,\n", usage);
    //seq_printf(f, "\t\"Usuario_actual\": %u,\n", current_uid().val);
    seq_printf(f, "\t\"Procesos\": [\n");
    
    for_each_process(task) {
        cred = get_task_cred(task);
        state = task_state_to_char(task);
        vsize = task->mm ? task->mm->total_vm << (PAGE_SHIFT - 10) : 0;
        rss = task->mm ? get_mm_rss(task->mm) << (PAGE_SHIFT - 10) : 0;

        seq_printf(f, "\t\t{ \"Proceso\": \"%s\", \"PID\": %d, \"UID\": %u, \"Estado\": \"%c\", \"Memoria_virtual\": %lu, \"Memoria_fisica\": %lu },\n",
               task->comm, task->pid, cred->uid.val, state, vsize, rss);
        put_cred(cred);
    }

    seq_printf(f, "\t\t{ \"Proceso\": \"NAC\", \"PID\": -1, \"UID\": -1, \"Estado\": \"NAC\", \"Memoria_virtual\": 0, \"Memoria_fisica\": 0 }\n");
    seq_printf(f, "\t]\n");

    
    seq_printf(f, "}\n");
    return 0;
}

static int cpuinfo_proc_open(struct inode *inode, struct file *file) {
    return single_open(file, show_cpu_stat, NULL);
}

static const struct proc_ops Cpuinfo_fops = {
    .proc_open = cpuinfo_proc_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release
};

static int __init cpu_module_init(void) {
    printk(KERN_INFO "Módulo del kernel cargado.\n");
    proc_create(FileProc, 0777, NULL, &Cpuinfo_fops);
    printk(KERN_INFO "Archivo creado: /proc/%s\n", FileProc);
    return 0;
}

static void __exit cpu_module_exit(void) {
    printk(KERN_INFO "Módulo del kernel descargado.\n");
    remove_proc_entry(FileProc, NULL);
}

module_init(cpu_module_init);
module_exit(cpu_module_exit);
