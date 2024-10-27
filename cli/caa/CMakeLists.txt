add_library(__PROJECT_NAME__ INTERFACE)
target_sources(${PROJECT_NAME} INTERFACE)
set(${PROJECT_NAME}_DIR ${CMAKE_CURRENT_LIST_DIR})

set(${PROJECT_NAME}_INCLUDE_DIRS "")
file(GLOB_RECURSE FOUND_PUBLIC_INTERFACES_DIRS
     "${${PROJECT_NAME}_DIR}/*/PublicInterfaces"
     "${${PROJECT_NAME}_DIR}/PublicInterfaces")
foreach(dir ${FOUND_PUBLIC_INTERFACES_DIRS})
    if(IS_DIRECTORY ${dir})
        list(APPEND ${PROJECT_NAME}_INCLUDE_DIRS ${dir})
    endif()
endforeach()
target_include_directories(${PROJECT_NAME} INTERFACE ${${PROJECT_NAME}_INCLUDE_DIRS})

file(GLOB_RECURSE LIBS "${${PROJECT_NAME}_DIR}/*.lib")
target_link_libraries(${PROJECT_NAME} ${LIBS})



