# CAA 脚手架
# add-class
添加一个类，使用前先将当前目录切换至Module目录下，这样程序会自动识别引用目录的源代码目录。
```
opencad caa add-class <class-name>
```
## `_` 分割项作为Namespace
`<class-name>`支持`_`，当出现`_`时，会自动将分割项作为Namespace，如`A_B_C`，创建出的头文件示例如下：
```
#ifndef __A_B_C___H
#define __A_B_C___H
namespace A{
    namespace B{
        class C{
        public:
            C();
        };
    }
}
#endif
```
## CAA类名
`<class-name>`支持CAA类名，如`A_B_IDrawing`，创建出的头文件示例如下：
```
#ifndef __A_B_IDrawing___H
#define __A_B_IDrawing___H
namespace A{
    namespace B{
        class IDrawing{
        public:
            CATIDrawing_var Target;
            IDrawing();
        };
    }
}
#endif
```
同时脚手架会自动导入相关的Module和Framework。
该功能是可选项。
# add-module
```
opencad caa add-module <module-name>
```
添加一个Module，使用前先将当前目录切换至Framework目录下，这样程序会自动识别引用目录的源代码目录。
# add-framework
```
opencad caa add-framework <framework-name>
```
添加一个Framework，使用前先将当前目录切换至Project目录下，这样程序会自动识别引用目录的源代码目录。
# search
```
opencad caa search <value>
```
在CAA文档中搜索目标值，并罗列搜索结果。

# search-guide
```
opencad caa search-guide
```
搜索向导，用于安装搜索包。

# info
```
opencad caa info <class-name>
```
查看CAA类的详细信息。

# openfile
```
opencad caa openfile <class-name>
```
打开CAA类的帮助文档。

# import
```
opencad caa import <class-name>
```
将CAA类所在的Module和Framework导入到当前项目中。