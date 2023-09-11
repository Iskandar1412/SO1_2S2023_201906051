#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/export-internal.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif


static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0x45db931b, "proc_create" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0xce4f6bb6, "single_open" },
	{ 0x40c7247c, "si_meminfo" },
	{ 0xd65b4e21, "seq_printf" },
	{ 0xf06a487c, "init_uts_ns" },
	{ 0xac0dde12, "remove_proc_entry" },
	{ 0xd8e57183, "seq_read" },
	{ 0x6e7fd3b8, "seq_lseek" },
	{ 0x8c5a766b, "seq_release" },
	{ 0xbdfb6dbb, "__fentry__" },
	{ 0x122c3a7e, "_printk" },
	{ 0x453e7dc, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "C520F58A3DC4E8B976698E7");
