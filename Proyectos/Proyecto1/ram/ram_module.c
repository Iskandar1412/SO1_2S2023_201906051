// Kernel: linux-headers-6.2.0-32-generic
#include <linux/fs.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/mm.h>
#include <linux/hugetlb.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <linux/vmalloc.h>
#include <asm/page.h>
#include <asm/pgtable.h>
#include <asm/uaccess.h>
#include <linux/utsname.h>

#define FileProc "ram_201906051"

MODULE_AUTHOR("Juan Urbina");
MODULE_DESCRIPTION("Sistemas Operativos 1");
MODULE_LICENSE("GPL");

struct sysinfo i;

unsigned long committed;
unsigned long allowed;
long cached;
unsigned long pages[NR_LRU_LISTS];
int lru;

static int show_memory_stat(struct seq_file *f, void *v){
    si_meminfo(&i);
    struct new_utsname *utsname;
    utsname = init_utsname();
	
    // seq_printf(f,"%lu\n",((i.freeram*100)/i.totalram));
    seq_printf(f,"{\n");
    seq_printf(f, "\t\"Nombre_equipo\": \"%s\",\n", utsname->nodename);
    seq_printf(f, "\t\"Uso_ram\":[\n");
    seq_printf(f, "\t\t{\n");
    seq_printf(f,"\t\t\t\"total_ram\":" "%lu,\n", ((i.totalram) << (PAGE_SHIFT -10))/1024 );
    seq_printf(f,"\t\t\t\"Ram_en_uso\":" "%lu,\n",(  ( ( ( (i.totalram) << (PAGE_SHIFT -10) )  -  ( (i.freeram) << (PAGE_SHIFT -10) ) )) /1024 ) );
    seq_printf(f,"\t\t\t\"Ram_libre\":""%lu,\n",( (i.freeram) << (PAGE_SHIFT -10) ) /1024);
    seq_printf(f,"\t\t\t\"Porcentaje_en_uso\":" "%lu\n",(  (( ( ( (i.totalram) << (PAGE_SHIFT -10) )  -  ( (i.freeram) << (PAGE_SHIFT -10) ) )) /1024 )/100 ));
    seq_printf(f, "\t\t}\n");
    seq_printf(f,"\t]\n}\n");
    return 0;
}

static int meminfo_proc_open(struct inode *inode, struct file*file){
    return single_open(file,show_memory_stat, NULL);
}

static const struct proc_ops Meminfo_fops = {
    .proc_open = meminfo_proc_open,
    .proc_read = seq_read,
    .proc_lseek  = seq_lseek,
	.proc_release = seq_release
};


static int __init start_function(void){
    printk(KERN_INFO "Modulo RAM cargado");
    proc_create (FileProc, 0777, NULL, &Meminfo_fops);
	printk(KERN_INFO "Archivo Creado: /proc/%s\n",FileProc);
	return 0;
}

static void __exit clean_function(void){
    printk(KERN_INFO "Modulo RAM eliminado");
    remove_proc_entry(FileProc, NULL);
}

module_init(start_function);
module_exit(clean_function);