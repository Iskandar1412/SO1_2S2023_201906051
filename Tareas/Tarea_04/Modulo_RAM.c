#include <linux/init.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>

MODULE_LICENSE("GPL")
MODULE_AUTHOR("Juan Urbina")
MODULE_DESCRIPTION("Modulo RAM")
MODULE_VERSION("0.1")

static int my_proc_show(struct seq_file *m, void *v) {
    struct sysinfo info;
    si_meminfo(&info);
    
}