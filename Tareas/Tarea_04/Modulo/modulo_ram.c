#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>

#define MODULE_NAME "modulo_ram"
#define PROC_FILENAME "ram_info"

static int meminfo_read_proc(char *page, char **start, off_t off,
                             int count, int *eof, void *data)
{
    struct sysinfo i;
    si_meminfo(&i);

    unsigned long total_ram = i.totalram * (PAGE_SIZE / 1024);
    unsigned long ram_in_use = (i.totalram - i.freeram) * (PAGE_SIZE / 1024);
    unsigned long ram_free = i.freeram * (PAGE_SIZE / 1024);
    int ram_percentage = (int)((ram_in_use * 100) / total_ram);

    return sprintf(page,
                   "{\n"
                   "\"total_ram\": %lu,\n"
                   "\"Ram_en_uso\": %lu,\n"
                   "\"Ram_libre\": %lu,\n"
                   "\"Porcentaje_en_uso\": %d\n"
                   "}\n",
                   total_ram, ram_in_use, ram_free, ram_percentage);
}

static int ram_proc_show(struct seq_file *m, void *v) {
    char buf[4096];
    int len = meminfo_read_proc(buf, NULL, 0, sizeof(buf), NULL, NULL);
    if (len > 0)
        seq_write(m, buf, len);
    return 0;
}

static int ram_proc_open(struct inode *inode, struct file *file) {
    return single_open(file, ram_proc_show, NULL);
}

static const struct proc_ops ram_proc_ops = {
    .proc_open = ram_proc_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release,
};

static int __init ram_module_init(void) {
    printk(KERN_INFO "ram_module: 201906051\n");

    proc_create(PROC_FILENAME, 0, NULL, &ram_proc_ops);

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