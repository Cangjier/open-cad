add_library(__PROJECT_NAME___ INTERFACE)
target_sources(__PROJECT_NAME___ INTERFACE)
set(__PROJECT_NAME____DIR ${CMAKE_CURRENT_LIST_DIR})

# 首先查找所有文件
file(GLOB_RECURSE __PROJECT_NAME____FOUND_INTERFACE_FILES 
    "*.h")

# 提取父目录路径
set(__PROJECT_NAME____INCLUDE_DIRS "")
foreach(file_path ${__PROJECT_NAME____FOUND_INTERFACE_FILES})
    get_filename_component(dir_path ${file_path} DIRECTORY)
    list(APPEND __PROJECT_NAME____INCLUDE_DIRS ${dir_path})
endforeach()

# 移除重复项
list(REMOVE_DUPLICATES __PROJECT_NAME____INCLUDE_DIRS)

target_include_directories(__PROJECT_NAME___ INTERFACE ${__PROJECT_NAME____INCLUDE_DIRS})

file(GLOB_RECURSE __PROJECT_NAME____LIBS "${__PROJECT_NAME____DIR}/*.lib")
target_link_libraries(__PROJECT_NAME___ ${__PROJECT_NAME____LIBS})