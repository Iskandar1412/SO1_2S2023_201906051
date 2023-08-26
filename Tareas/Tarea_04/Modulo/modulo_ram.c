#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>

#define PROC_FILENAME "ram_info"

static int ram_proc_show(struct seq_file *m, void *v) {
    struct sysinfo info;
    si_meminfo(&info);

    unsigned long total_ram = info.totalram * (info.mem_unit / 1024);
    unsigned long ram_in_use = (info.totalram - info.freeram) * (info.mem_unit / 1024);
    unsigned long ram_free = info.freeram * (info.mem_unit / 1024);
    int ram_percentage = (int)((ram_in_use * 100) / total_ram);

    seq_printf(m, "{\n");
    seq_printf(m, "\"total_ram\": %lu,\n", total_ram);
    seq_printf(m, "\"Ram_en_uso\": %lu,\n", ram_in_use);
    seq_printf(m, "\"Ram_libre\": %lu,\n", ram_free);
    seq_printf(m, "\"Porcentaje_en_uso\": %d\n", ram_percentage);
    seq_printf(m, "}\n");

    return 0;
}

static int ram_proc_open(struct inode *inode, struct file *file) {
    return single_open(file, ram_proc_show, NULL);
}

static const struct proc_ops ram_proc_fops = {
    .proc_open = ram_proc_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};

static int __init ram_module_init(void) {
    printk(KERN_INFO "ram_module: 201906051\n");

    proc_create(PROC_FILENAME, 0, NULL, &ram_proc_fops);

    return 0;
}

static void __exit ram_module_exit(void) {
    remove_proc_entry(PROC_FILENAME, NULL);
    printk(KERN_INFO "ram_module: Juan Urbina\n");
}

module_init(ram_module_init);
module_exit(ram_module_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Juan Urbina");
MODULE_DESCRIPTION("RAM Info Module");