import { File } from "../.tsc/System/IO/File";
let TidyCppGenerator = (config: {
    namespace: string,
    exportDefine: string,
}) => {
    let generate_SUPPORT_NULLPTR = () => {
        return `
#ifndef SUPPORT_NULLPTR
    #if defined(_MSC_VER) && _MSC_VER >= 1600
        #define SUPPORT_NULLPTR nullptr
    #else
        #define SUPPORT_NULLPTR NULL
    #endif
#endif`;
    };
    let generate_SUPPORT_STD_STRINGSTREAM = () => {
        return `
#ifndef SUPPORT_STD_STRINGSTREAM
    #ifdef _MSC_VER
        #if _MSC_VER >= 1400
            #define SUPPORT_STD_STRINGSTREAM 1
        #else
            #define SUPPORT_STD_STRINGSTREAM 0
        #endif
    #else
        #define SUPPORT_STD_STRINGSTREAM 1
    #endif

    #if SUPPORT_STD_STRINGSTREAM
        #include <sstream>
    #endif
#endif`;
    };
    let generate_SUPPORT_STD_WSTRING = () => {
        return `
#ifndef SUPPORT_STD_WSTRING
    #ifdef _MSC_VER
        #if _MSC_VER >= 1200
            #define SUPPORT_STD_WSTRING 1
        #else
            #define SUPPORT_STD_WSTRING 0
        #endif
    #else
        #define SUPPORT_STD_WSTRING 1
    #endif
    #if SUPPORT_STD_WSTRING
        // #include <wstring>
    #endif
#endif`;
    };
    let generate_SUPPORT_EXPLICIT = () => {
        return `
#ifndef SUPPORT_EXPLICIT
#ifdef _MSC_VER
    #if _MSC_VER >= 1800
        #define SUPPORT_EXPLICIT explicit
    #else
        #define SUPPORT_EXPLICIT
    #endif
#endif
#endif`;
    };
    let generate_SUPPORT_INT64 = () => {
        return `
#ifndef SUPPORT_INT64
    #ifdef _MSC_VER
        #if _MSC_VER <= 1800
            #define SUPPORT_INT64 __int64
        #else
            #define SUPPORT_INT64 std::int64_t
        #endif
    #else
        #define SUPPORT_INT64 std::int64_t
    #endif
#endif`;
    };
    let generate_SUPPORT_STD_OSTRINGSTREAM = () => {
        return `
#ifndef SUPPORT_STD_OSTRINGSTREAM
    #if _MSC_VER >= 1400
        #define SUPPORT_STD_OSTRINGSTREAM 1
    #else
        #define SUPPORT_STD_OSTRINGSTREAM 0
    #endif
#endif`;
    };
    let generate_SUPPORT_RVALUE_REFERENCES = () => {
        return `
#ifndef SUPPORT_RVALUE_REFERENCES
    #ifdef _MSC_VER
        #if _MSC_VER >= 1800
            #define SUPPORT_RVALUE_REFERENCES 1
        #else
            #define SUPPORT_RVALUE_REFERENCES 0
        #endif
    #endif
#endif`;
    };
    let generate_SUPPORT_STD_FUNCTION = () => {
        return `
#ifndef SUPPORT_STD_FUNCTION
    #ifdef _MSC_VER
        #if _MSC_VER >= 1800
            #define SUPPORT_STD_FUNCTION 1
        #else
            #define SUPPORT_STD_FUNCTION 0
        #endif
    #endif
#endif

#if SUPPORT_STD_FUNCTION
    #include <functional>
#endif`;
    };
    let generateStringCommonClass = (namespace: string) => {
        let header = `

#ifndef SUPPORT_STD_TOSTRING
#define SUPPORT_STD_TOSTRING
#include <string>
#if defined(_MSC_VER) && _MSC_VER < 1600
namespace std {
    std::string to_string(int value);
    
    std::string to_string(unsigned int value);

    std::string to_string(long value);

    std::string to_string(unsigned long value);

    std::string to_string(long long value);

    std::string to_string(unsigned long long value);

    std::string to_string(float value);

    std::string to_string(double value);

    int stoi(const std::string& str);

    long stol(const std::string& str);

    long long stoll(const std::string& str);

    float stof(const std::string& str);

    double stod(const std::string& str);
}
    #endif
#endif`;
        let source = `
#include "${namespace}_StringCommon.h"
#if defined(_MSC_VER) && _MSC_VER < 1600
#include <sstream>
namespace std {
    std::string to_string(int value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }
    
    std::string to_string(unsigned int value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(long value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(unsigned long value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(long long value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(unsigned long long value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(float value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    std::string to_string(double value) {
        std::stringstream ss;
        ss << value;
        return ss.str();
    }

    int stoi(const std::string& str) {
        int result = 0;
        std::istringstream iss(str);
        iss >> result;
        return result;
    }

    long stol(const std::string& str) {
        long result = 0;
        std::istringstream iss(str);
        iss >> result;
        return result;
    }

    long long stoll(const std::string& str) {
        long long result = 0;
        std::istringstream iss(str);
        iss >> result;
        return result;
    }

    float stof(const std::string& str) {
        float result = 0;
        std::istringstream iss(str);
        iss >> result;
        return result;
    }

    double stod(const std::string& str) {
        double result = 0;
        std::istringstream iss(str);
        iss >> result;
        return result;
    }
}
#endif`;
        return [
            {
                FileName: `${namespace}_StringCommon.h`,
                Content: header
            },
            {
                FileName: `${namespace}_StringCommon.cpp`,
                Content: source
            }
        ]
    };
    let generateStringClass = (namespace: string, className: string, targetEncoding: number, exportDefine: string, allStringClassNames: string[]) => {
        let headerLines = [] as string[];
        let sourceLines = [] as string[];
        sourceLines.push(`#include "${namespace}_${className}.h"
using namespace ${namespace};`);
        headerLines.push(`#ifndef __${namespace.toUpperCase()}_${className.toUpperCase()}_H__`);
        headerLines.push(`#define __${namespace.toUpperCase()}_${className.toUpperCase()}_H__`);
        headerLines.push(`#include <string>`);
        headerLines.push(`#include <vector>`);
        headerLines.push(`#include "${namespace}_StringUtil.h"`);
        headerLines.push(`#include "${namespace}_StringCommon.h"`);

        headerLines.push(generate_SUPPORT_NULLPTR());
        // SUPPORT_STD_STRINGSTREAM宏定义
        headerLines.push(generate_SUPPORT_STD_STRINGSTREAM());
        // SUPPORT_EXPLICIT宏定义
        headerLines.push(generate_SUPPORT_EXPLICIT());
        // SUPPORT_INT64宏定义，64位
        headerLines.push(generate_SUPPORT_INT64());
        // SUPPORT_STD_OSTRINGSTREAM宏定义
        headerLines.push(generate_SUPPORT_STD_OSTRINGSTREAM());
        // SUPPORT_STD_WSTRING宏定义
        headerLines.push(generate_SUPPORT_STD_WSTRING());
        // SUPPORT_RVALUE_REFERENCES宏定义
        headerLines.push(generate_SUPPORT_RVALUE_REFERENCES());
        // SUPPORT_STD_FUNCTION宏定义
        headerLines.push(generate_SUPPORT_STD_FUNCTION());

        for (let i = 0; i < allStringClassNames.length; i++) {
            if (allStringClassNames[i] == className) {
                continue;
            }
            headerLines.push(`#include "${namespace}_${allStringClassNames[i]}.h"`);
            headerLines.push(`namespace ${namespace} {
class ${allStringClassNames[i]};
}`);
        }

        headerLines.push(`namespace ${namespace} {`);
        headerLines.push(`class ${exportDefine} ${className} {`);
        headerLines.push(`public:`);
        headerLines.push(`    std::string Target;
    int TargetEncoding;
    ${className}() {
        this->Target = "";
        this->TargetEncoding = ${targetEncoding};
    }`);

        // 从wchar_t*转换的构造函数
        headerLines.push(`    ${className}(const wchar_t* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = StringUtil::To(target, TargetEncoding);
        }
    }`);

        // 从std::wstring转换的构造函数
        headerLines.push(`#if SUPPORT_STD_WSTRING
        ${className}(const std::wstring& target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = StringUtil::To(target.c_str(), TargetEncoding);
    }
#endif`);

        // 从std::string转换的构造函数
        headerLines.push(`    ${className}(const std::string& target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = target;
    }`);

        // 从const char*转换的构造函数
        headerLines.push(`    ${className}(const char* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = target;
        }
    }`);

        // 从char*转换的构造函数
        headerLines.push(`    ${className}(char* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = target;
        }
    }`);

        // 从std::stringstream转换的构造函数
        headerLines.push(`#if SUPPORT_STD_STRINGSTREAM
    ${className}(const std::stringstream& target) {
        this->TargetEncoding = ${targetEncoding};
        std::ostringstream ss;
        ss << target.rdbuf();
        this->Target = ss.str();
    }
#endif`);

        // 从int转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(int target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = std::to_string(target);
    }`);

        // 从long转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(long target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从SUPPORT_INT64转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(SUPPORT_INT64 target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从SUPPORT_INT64转换的构造函数，使用指定进制
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(SUPPORT_INT64 value, const ${className}& base) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::string();`);
        headerLines.push(`        int baseLength = base.Length();`);
        headerLines.push(`        while (true) {`);
        headerLines.push(`            SUPPORT_INT64 next = value / baseLength;`);
        headerLines.push(`            SUPPORT_INT64 mod = value % baseLength;`);
        headerLines.push(`            Insert(0, base[(int)mod]);`);
        headerLines.push(`            if (next == 0) {`);
        headerLines.push(`                break;`);
        headerLines.push(`            }`);
        headerLines.push(`            value = next;`);
        headerLines.push(`        }`);
        headerLines.push(`    }`);

        // 从unsigned short转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(unsigned short target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从unsigned int转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(unsigned int target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从unsigned long long转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(unsigned long long target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从double转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(double target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`#if SUPPORT_STD_OSTRINGSTREAM`);
        headerLines.push(`        std::ostringstream out;`);
        headerLines.push(`        out.precision(14);`);
        headerLines.push(`        out << std::fixed << target;`);
        headerLines.push(`        this->Target = out.str();`);
        headerLines.push(`#else`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`#endif`);
        headerLines.push(`    }`);

        // 从char转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(char target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::string();`);
        headerLines.push(`        this->Target.append(1, target);`);
        headerLines.push(`    }`);

        // 从float转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(float target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = std::to_string(target);`);
        headerLines.push(`    }`);

        // 从bool转换的构造函数
        headerLines.push(`    SUPPORT_EXPLICIT ${className}(bool target) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        this->Target = target ? "true" : "false";`);
        headerLines.push(`    }`);

        // 从另一个String类转换的构造函数
        for (let stringClassName of allStringClassNames) {
            if (stringClassName == className) {
                continue;
            }
            headerLines.push(`    ${className}(const ${stringClassName}& target);`);

            headerLines.push(`#if SUPPORT_RVALUE_REFERENCES`);
            headerLines.push(`    ${className}(const ${stringClassName}&& target);`);
            headerLines.push(`#endif`);

            sourceLines.push(`    ${className}::${className}(const ${stringClassName}& target) {`);
            sourceLines.push(`        this->TargetEncoding = ${targetEncoding};`);
            sourceLines.push(`        if (target.TargetEncoding == this->TargetEncoding) {`);
            sourceLines.push(`            this->Target = target.Target;`);
            sourceLines.push(`        } else {`);
            sourceLines.push(`            this->Target = StringUtil::To(target.Target, target.TargetEncoding, this->TargetEncoding);`);
            sourceLines.push(`        }`);
            sourceLines.push(`    }`);

            sourceLines.push(`#if SUPPORT_RVALUE_REFERENCES`);
            sourceLines.push(`    ${className}::${className}(const ${stringClassName}&& target) {`);
            sourceLines.push(`        this->TargetEncoding = ${targetEncoding};`);
            sourceLines.push(`        if (target.TargetEncoding == this->TargetEncoding) {`);
            sourceLines.push(`            this->Target = target.Target;`);
            sourceLines.push(`        } else {`);
            sourceLines.push(`            this->Target = StringUtil::To(target.Target, target.TargetEncoding, this->TargetEncoding);`);
            sourceLines.push(`        }`);
            sourceLines.push(`    }`);
            sourceLines.push(`#endif`);
        }

        // hexbase
        headerLines.push(`    static ${className} HexBase() {`);
        headerLines.push(`        return "0123456789ABCDEF";`);
        headerLines.push(`    }`);

        // Hex
        headerLines.push(`    static ${className} Hex(SUPPORT_INT64 value) {`);
        headerLines.push(`        return ${className}(value, HexBase());`);
        headerLines.push(`    }`);

        // FromPointer
        headerLines.push(`    static ${className} FromPointer(void* value) {
        return "0x"+Hex(reinterpret_cast<SUPPORT_INT64>(value));
}`);

        // ToChars
        headerLines.push(`    const char* ToChars() const {`);
        headerLines.push(`        return this->Target.c_str();`);
        headerLines.push(`    }`);

        // Clone
        headerLines.push(`    char* Clone() const {`);
        headerLines.push(`        char* result = new char[this->Target.size() + 1];`);
        headerLines.push(`        memset(result, 0, this->Target.size() + 1);`);
        headerLines.push(`        strcpy(result, this->Target.c_str());`);
        headerLines.push(`        return result;`);
        headerLines.push(`    }`);

        // ToWString
        headerLines.push(`#if SUPPORT_STD_WSTRING
    std::wstring ToWString() const {
    return StringUtil::To(Target, TargetEncoding);
    }
#endif`);

        // Length
        headerLines.push(`    int Length() const {`);
        headerLines.push(`        return (int)this->Target.length();`);
        headerLines.push(`    }`);

        // SubString
        headerLines.push(`    ${className} SubString(int start, int length = -1) const {`);
        headerLines.push(`    if (length == -1)
        return Target.substr(start);
    else
        return Target.substr(start, length);`);
        headerLines.push(`    }`);

        // Insert
        headerLines.push(`     ${className}& Insert(int index, const ${className}& value) {`);
        headerLines.push(`        this->Target.insert(index, value.Target);`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // IndexOf
        headerLines.push(`    int IndexOf(const ${className}& value, int start = 0) const {`);
        headerLines.push(`        size_t result = this->Target.find(value.Target, start);`);
        headerLines.push(`        if (result == std::string::npos) {`);
        headerLines.push(`            return -1;`);
        headerLines.push(`        }`);
        headerLines.push(`        return (int)result;`);
        headerLines.push(`    }`);

        // LastIndexOf
        headerLines.push(`    int LastIndexOf(const ${className}& value, int start = -1) const {`);
        headerLines.push(`        start = start == -1 ? std::string::npos : start;`);
        headerLines.push(`        size_t result = this->Target.rfind(value.Target, start);`);
        headerLines.push(`        if (result == std::string::npos) {`);
        headerLines.push(`            return -1;`);
        headerLines.push(`        }`);
        headerLines.push(`        return (int)result;`);
        headerLines.push(`    }`);

        // LastIndexOf
        headerLines.push(`
int LastIndexOf(const std::vector<${className}>& values, int start = -1) const {
    start = start == -1 ? std::string::npos : start;
    int result = -1;
    for (size_t i = 0; i < values.size(); i++) {
        const ${className}& value = values[i];
        int index = LastIndexOf(value, start);
        if (index != -1) {
            if (index > result) {
                result = index;
            }
        }
    }
    return result;
}`);

        // Replace
        headerLines.push(`    ${className} Replace(const ${className}& oldValue, const ${className}& newValue) const {`);
        headerLines.push(`        std::string temp = Target;
        std::string oldString = oldValue.Target;
        std::string newString = newValue.Target;
        std::string::size_type index = 0;
        std::string::size_type newLength = newString.size();
        std::string::size_type oldLength = oldString.size();
        index = temp.find(oldString, index);
        while ((index != std::string::npos))
        {
            temp.replace(index, oldLength, newString);
            index = temp.find(oldString, (index + newLength));
        }
        return temp;`);
        headerLines.push(`    }`);

        // Replace values
        headerLines.push(`    ${className} Replace(const std::vector<${className}>& oldValues, const std::vector<${className}>& newValues) const {`);
        headerLines.push(`        ${className} result = Target;`);
        headerLines.push(`        for (size_t i = 0; i < oldValues.size(); i++) {`);
        headerLines.push(`            result = result.Replace(oldValues[i], newValues[i]);`);
        headerLines.push(`        }`);
        headerLines.push(`        return result;`);
        headerLines.push(`    }`);

        // Append
        headerLines.push(`    ${className}& Append(const ${className}& value) {`);
        headerLines.push(`        this->Target.append(value.Target);`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // Append values
        headerLines.push(`
    ${className}& Append(const std::vector<${className}>& values) {
        for(size_t i = 0; i < values.size(); i++) {
            this->Target.append(values[i].Target);
        }
        return *this;
    }`);

        // AppendLine
        headerLines.push(`    ${className}& AppendLine(const ${className}& value) {`);
        headerLines.push(`        this->Target.append(value.Target);`);
        headerLines.push(`        this->Target.append("\\r\\n");`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // AppendLine just line
        headerLines.push(`    ${className}& AppendLine() {`);
        headerLines.push(`        this->Target.append("\\r\\n");`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // MiddleValue
        headerLines.push(`    ${className} MiddleValue(const ${className}& startValue, const ${className}& endValue, int index = 0) const {`);
        headerLines.push(`        size_t offset = 0;
        for (int i = 0; i <= index; i++)
        {
            size_t startIndex = Target.find(startValue.Target, offset);
            if (startIndex == std::string::npos)
            {
                return "";
            }
            size_t endIndex = Target.find(endValue.Target, offset + startValue.Length());
            if (endIndex == std::string::npos)
            {
                return "";
            }
            if (i == index)
            {
                return Target.substr(startIndex + (int)startValue.Length(), endIndex - startIndex - (int)startValue.Length());
            }
            else
            {
                offset = endIndex + endValue.Length();
            }
        }
        return "";`);
        headerLines.push(`    }`);

        // MiddleCount
        headerLines.push(`    int MiddleCount(const ${className}& startValue, const ${className}& endValue) const {`);
        headerLines.push(`        size_t offset = 0;
        int count = 0;
        while (true)
        {
            size_t startIndex = Target.find(startValue.Target, offset);
            if (startIndex == std::string::npos)
            {
                return count;
            }
            size_t endIndex = Target.find(endValue.Target, offset + startValue.Length());
            if (endIndex == std::string::npos)
            {
                return count;
            }
            offset = endIndex + endValue.Length();
            count++;
        }
        return count;`);
        headerLines.push(`    }`);

        // Repeat
        headerLines.push(`    static ${className} Repeat(const ${className} value, int count) {`);
        headerLines.push(`        ${className} result;`);
        headerLines.push(`        for (int i = 0; i < count; i++) {`);
        headerLines.push(`            result.Append(value);`);
        headerLines.push(`        }`);
        headerLines.push(`        return result;`);
        headerLines.push(`    }`);

        // Repeat
        headerLines.push(`    ${className} Repeat(int count) const {`);
        headerLines.push(`        ${className} result;`);
        headerLines.push(`        for (int i = 0; i < count; i++) {`);
        headerLines.push(`            result.Append(*this);`);
        headerLines.push(`        }`);
        headerLines.push(`        return result;`);
        headerLines.push(`    }`);

        // Trim
        headerLines.push(`    ${className} Trim(const ${className}& chars = " ") const {`);
        headerLines.push(`        std::string result = Target;
        std::string trimChars = chars.Target;
        // Trim from the beginning  
        std::string::iterator it = result.begin();
        while (it != result.end() && trimChars.find(*it) != std::string::npos) {
            ++it;
        }
        result.erase(result.begin(), it);

        // Trim from the end  
        std::reverse_iterator<std::string::iterator> rit = result.rbegin();
        while (rit != result.rend() && trimChars.find(*rit) != std::string::npos) {
            ++rit;
        }
        result.erase(rit.base(), result.end());

        return result;`);
        headerLines.push(`    }`);

        // TrimStart
        headerLines.push(`    ${className} TrimStart(const ${className}& chars = " ") const {`);
        headerLines.push(`        std::string result = Target;
        std::string trimChars = chars.Target;
        size_t pos = result.find_first_not_of(trimChars);
        if (pos != std::string::npos) {
            return result.substr(pos);
        }
        else {
            return ""; // 如果整个字符串都是由要删除的字符组成，则返回空字符串  
        }`);
        headerLines.push(`    }`);

        // TrimEnd
        headerLines.push(`    ${className} TrimEnd(const ${className}& chars = " ") const {`);
        headerLines.push(`        std::string result = Target;
        std::string trimChars = chars.Target;

        std::reverse_iterator<std::string::iterator> rit = result.rbegin();
        while (rit != result.rend() && trimChars.find(*rit) != std::string::npos) {
            ++rit;
        }
        result.erase(rit.base(), result.end());

        return result;`);
        headerLines.push(`    }`);

        // OnlyNumber
        headerLines.push(`    ${className} OnlyNumber() const {`);
        headerLines.push(`        ${className} result;
        for(size_t i = 0; i < Target.size(); i++) {
            if(Target[i] >= '0' && Target[i] <= '9') {
                result.Append(Target[i]);
            }
        }
        return result;`);
        headerLines.push(`    }`);

        // RemoveChars
        headerLines.push(`
    ${className} RemoveChars(const ${className}& chars) const {
        ${className} result;
        for(size_t i = 0; i < Target.size(); i++) {
            if(chars.IndexOf(Target[i]) == -1) {
                result.Append(Target[i]);
            }
        }
        return result;
    }`);

        // IsEmpty
        headerLines.push(`    bool IsEmpty() const {`);
        headerLines.push(`        return Target.empty();`);
        headerLines.push(`    }`);

        // Remove
        headerLines.push(`    ${className} Remove(int start, int length = -1) const {`);
        headerLines.push(`        std::string result = Target;
			if (length == -1)
			{
				result.erase(start);
			}
			else
			{
				result.erase(start, length);
			}
			return result;`);
        headerLines.push(`    }`);

        // StartsWith
        headerLines.push(`    bool StartsWith(const ${className}& value) const {`);
        headerLines.push(`        return Target.find(value.Target) == 0;`);
        headerLines.push(`    }`);

        // EndsWith
        headerLines.push(`    bool EndsWith(const ${className}& value) const {`);
        headerLines.push(`        return Target.rfind(value.Target) == (Target.size() - value.Length());`);
        headerLines.push(`    }`);

        // Contains
        headerLines.push(`    bool Contains(const ${className}& value) const {`);
        headerLines.push(`        return Target.find(value.Target) != std::string::npos;`);
        headerLines.push(`    }`);

        // FillEnd
        headerLines.push(`    ${className} FillEnd(int length, const ${className}& value) const {`);
        headerLines.push(`        ${className} result = Target;
        while (result.Length() < length)
        {
            result.Append(value);
        }
        return result;`);
        headerLines.push(`    }`);

        // FillStart
        headerLines.push(`    ${className} FillStart(int length, const ${className}& value) const {`);
        headerLines.push(`        ${className} result = Target;
        while (result.Length() < length)
        {
            result.Insert(0, value);
        }
        return result;`);
        headerLines.push(`    }`);

        // Format {0}
        headerLines.push(`    ${className} Format(const ${className}& value0) const {`);
        headerLines.push(`        return Replace("{0}", value0);`);
        headerLines.push(`    }`);

        // Format {0} {1}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3} {4}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6} {7}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6, const ${className}& value7) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6).Replace("{7}", value7);`);
        headerLines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6} {7} {8}
        headerLines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6, const ${className}& value7, const ${className}& value8) const {`);
        headerLines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6).Replace("{7}", value7).Replace("{8}", value8);`);
        headerLines.push(`    }`);

        // Clear
        headerLines.push(`    ${className}& Clear() {`);
        headerLines.push(`        this->Target.clear();`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // IsNumber
        headerLines.push(`
    bool IsNumber() const {
        if (Target.empty()) {
            return false;
        }
        for(size_t i = 0; i < Target.size(); i++) {
            if (Target[i] < '0' || Target[i] > '9') {
                return false;
            }
        }
        return true;
    }`);

        // ToInt
        headerLines.push(`
    int ToInt() const {
        try {
            return std::stoi(Target);
        } catch (...) {
            throw new std::exception("String is not a number.");
        }
    }`);

        // ToFloat
        headerLines.push(`    
    float ToFloat() const {
        try {
            return std::stof(Target);
        } catch (...) {
            throw new std::exception("String is not a number.");
        }
    }`);

        // ToDouble
        headerLines.push(`
    double ToDouble() const {
        try {
            return std::stod(Target);
        } catch (...) {
            throw new std::exception("String is not a number.");
        }
    }`);

        // ToInt64
        headerLines.push(`
    SUPPORT_INT64 ToInt64() const {
        try {
            return std::stoll(Target);
        } catch (...) {
            throw new std::exception("String is not a number.");
        }
    }`);

        // IsTrue
        headerLines.push(`    bool IsTrue() const {`);
        headerLines.push(`        return ToLower() == "true";`);
        headerLines.push(`    }`);

        // IsFalse
        headerLines.push(`    bool IsFalse() const {`);
        headerLines.push(`        return ToLower() == "false";`);
        headerLines.push(`    }`);

        // ToBool
        headerLines.push(`    bool ToBool() const {`);
        headerLines.push(`        if (ToLower() == "true") {`);
        headerLines.push(`            return true;`);
        headerLines.push(`        } else if (ToLower() == "false") {`);
        headerLines.push(`            return false;`);
        headerLines.push(`        } else {`);
        headerLines.push(`            throw new std::exception("String is not a boolean.");`);
        headerLines.push(`        }`);
        headerLines.push(`    }`);

        // To StdString
        headerLines.push(`    std::string ToStdString(unsigned int encodingPage) const {`);
        headerLines.push(`        return StringUtil::To(Target, TargetEncoding, encodingPage);`);
        headerLines.push(`    }`);

        // ToLower
        headerLines.push(`
    ${className} ToLower() const {
        std::string result = "";
        for(size_t i = 0; i < Target.size(); i++) {
            result.append(1, tolower(Target[i]));
        }
        return result;
    }`);

        // ToUpper
        headerLines.push(`
    ${className} ToUpper() const {
        std::string result = "";
        for(size_t i = 0; i < Target.size(); i++) {
            result.append(1, toupper(Target[i]));
        }
        return result;
    }`);

        // Split by chars
        headerLines.push(`    std::vector<${className}> Split(const ${className}& chars) const {`);
        headerLines.push(`        std::vector<${className}> result;
        std::string temp = Target;
        std::string splitChars = chars.Target;
        size_t index = 0;
        while (true)
        {
            size_t nextIndex = temp.find(splitChars, index);
            if (nextIndex == std::string::npos)
            {
                result.push_back(temp.substr(index));
                break;
            }
            result.push_back(temp.substr(index, nextIndex - index));
            index = nextIndex + splitChars.size();
        }
        return result;`);
        headerLines.push(`    }`);

        // Intersect
        headerLines.push(`    
    ${className} Intersect(const ${className}& value) const {
        std::string result;
        for(size_t i = 0; i < Target.size(); i++) {
            if(value.Contains(Target[i])) {
                result.append(1, Target[i]);
            }
        }
        return result;
    }`);

        // Map
        headerLines.push(`#if SUPPORT_STD_FUNCTION
        ${className} Map(std::function<${className}(${className})> func) const {
        ${className} result;
        for (char item : Target)
        {
            result.Append(func(item));
        }
        return result;
        }
        #endif`);

        // Index
        headerLines.push(`    ${className} operator[](int index) const {`);
        headerLines.push(`        return Target[index];`);
        headerLines.push(`    }`);

        // =
        headerLines.push(`    ${className}& operator=(const ${className}& value) {`);
        headerLines.push(`        this->TargetEncoding = ${targetEncoding};`);
        headerLines.push(`        if(this != &value) {`);
        headerLines.push(`            this->Target = value.Target;`);
        headerLines.push(`        }`);
        headerLines.push(`        return *this;`);
        headerLines.push(`    }`);

        // + const char*
        headerLines.push(`    ${className} operator+(const char* value) const {`);
        headerLines.push(`        return Target + value;`);
        headerLines.push(`    }`);

        // + std::string
        headerLines.push(`    ${className} operator+(const std::string& value) const {`);
        headerLines.push(`        return Target + value;`);
        headerLines.push(`    }`);

        // +
        headerLines.push(`    ${className} operator+(const ${className}& value) const {`);
        headerLines.push(`        return Target + value.Target;`);
        headerLines.push(`    }`);

        // + &&
        headerLines.push(`#if SUPPORT_RVALUE_REFERENCES`);
        headerLines.push(`    ${className} operator+(const ${className}&& value) const {`);
        headerLines.push(`        return Target + value.Target;`);
        headerLines.push(`    }`);
        headerLines.push(`#endif`);

        // + int
        headerLines.push(`    ${className} operator+(int value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + long
        headerLines.push(`    ${className} operator+(long value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + SUPPORT_INT64
        headerLines.push(`    ${className} operator+(SUPPORT_INT64 value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + unsigned int
        headerLines.push(`    ${className} operator+(unsigned int value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + float
        headerLines.push(`    ${className} operator+(float value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + double
        headerLines.push(`    ${className} operator+(double value) const {`);
        headerLines.push(`        return Target + std::to_string(value);`);
        headerLines.push(`    }`);

        // + bool
        headerLines.push(`    ${className} operator+(bool value) const {`);
        headerLines.push(`        return Target + (value ? "true" : "false");`);
        headerLines.push(`    }`);

        // + char
        headerLines.push(`    ${className} operator+(char value) const {`);
        headerLines.push(`        std::string result = Target;
        result.append(1, value);
        return result;`);
        headerLines.push(`    }`);

        //friend + const char *
        headerLines.push(`    friend ${className} operator+(const char* left, const ${className}& right) {`);
        headerLines.push(`        return left + right.Target;`);
        headerLines.push(`    }`);

        //friend + std::string
        headerLines.push(`    friend ${className} operator+(const std::string& left, const ${className}& right) {`);
        headerLines.push(`        return left + right.Target;`);
        headerLines.push(`    }`);

        // ==
        headerLines.push(`    bool operator==(const ${className}& value) const {`);
        headerLines.push(`        return Target == value.Target;`);
        headerLines.push(`    }`);

        // == const char *
        headerLines.push(`    bool operator==(const char* value) const {`);
        headerLines.push(`        return Target == value;`);
        headerLines.push(`    }`);

        // == std::string
        headerLines.push(`    bool operator==(const std::string& value) const {`);
        headerLines.push(`        return Target == value;`);
        headerLines.push(`    }`);

        // friend ==
        headerLines.push(`    friend bool operator==(const char* left, const ${className}& right) {`);
        headerLines.push(`        return left == right.Target;`);
        headerLines.push(`    }`);

        // friend ==
        headerLines.push(`    friend bool operator==(const std::string& left, const ${className}& right) {`);
        headerLines.push(`        return left == right.Target;`);
        headerLines.push(`    }`);

        // !=
        headerLines.push(`    bool operator!=(const ${className}& value) const {`);
        headerLines.push(`        return Target != value.Target;`);
        headerLines.push(`    }`);

        // !=
        headerLines.push(`    bool operator!=(const char* value) const {`);
        headerLines.push(`        return Target != value;`);
        headerLines.push(`    }`);

        // !=
        headerLines.push(`    bool operator!=(const std::string& value) const {`);
        headerLines.push(`        return Target != value;`);
        headerLines.push(`    }`);

        // friend !=
        headerLines.push(`    friend bool operator!=(const char* left, const ${className}& right) {`);
        headerLines.push(`        return left != right.Target;`);
        headerLines.push(`    }`);

        // friend !=
        headerLines.push(`    friend bool operator!=(const std::string& left, const ${className}& right) {`);
        headerLines.push(`        return left != right.Target;`);
        headerLines.push(`    }`);

        // <
        headerLines.push(`    bool operator<(const ${className}& value) const {`);
        headerLines.push(`        return Target < value.Target;`);
        headerLines.push(`    }`);

        // >
        headerLines.push(`    bool operator>(const ${className}& value) const {`);
        headerLines.push(`        return Target > value.Target;`);
        headerLines.push(`    }`);

        // std::ostream <<
        headerLines.push(`    friend std::ostream& operator<<(std::ostream& out, const ${className}& value) {`);
        headerLines.push(`        out << value.Target;`);
        headerLines.push(`        return out;`);
        headerLines.push(`    }`);

        // Join
        headerLines.push(`    static ${className} Join(const std::vector<${className}>& values, const ${className}& separator) {`);
        headerLines.push(`        ${className} result;
        for (size_t i = 0; i < values.size(); i++) {
            if (i != 0) {
                result.Append(separator);
            }
            result.Append(values[i]);
        }
        return result;`);
        headerLines.push(`    }`);

        for (let i = 0; i < 10; i++) {
            let parameters = [] as string[];
            for (let j = 0; j <= i; j++) {
                parameters.push(`const ${className}& value${j}`);
            }
            let parametersString = parameters.join(', ');
            headerLines.push(`    static std::vector<${className}> Vector(${parametersString}) {`);
            headerLines.push(`        std::vector<${className}> result;`);
            for (let j = 0; j <= i; j++) {
                headerLines.push(`        result.push_back(value${j});`);
            }
            headerLines.push(`        return result;`);
            headerLines.push(`    }`);
        }

        headerLines.push(`};`);
        headerLines.push(`};`);

        headerLines.push(`#endif`);

        return [{
            FileName: `${namespace}_${className}.h`,
            Content: headerLines.join('\r\n')
        }, {
            FileName: `${namespace}_${className}.cpp`,
            Content: sourceLines.join('\r\n')
        }];
    };

    let generateStringUtilClass = (namespace: string, exportDefine: string) => {
        let lines = [] as string[];
        lines.push(`#ifndef __${namespace.toUpperCase()}_STRING_UTIL_H__`);
        lines.push(`#define __${namespace.toUpperCase()}_STRING_UTIL_H__`);
        // SUPPORT_NULLPTR
        lines.push(generate_SUPPORT_NULLPTR());
        // SUPPORT_WSTRING
        lines.push(generate_SUPPORT_STD_WSTRING());
        lines.push(`
#include <string>
#include <vector>
namespace ${namespace} {
    class ${exportDefine} StringUtil {
    public:
    static unsigned int GetLocale();
    static std::string To(const std::string &value, unsigned int fromCodePage, unsigned int toCodePage);
    static std::string To(const wchar_t *value, unsigned int toCodePage);
#if SUPPORT_STD_WSTRING
    static std::wstring To(const std::string &value, unsigned int fromCodePage);
#endif
    };
};
#endif`);
        let classes = [] as {
            FileName: string,
            Content: string
        }[];
        classes.push({
            FileName: `${namespace}_StringUtil.h`,
            Content: lines.join('\r\n')
        });
        lines = [] as string[];
        lines.push(`#include "${namespace}_StringUtil.h"`);
        lines.push(`#ifdef _MSC_VER
#include "windows.h"
#elif __linux__
#include <iostream>
#include <string>
#include <cwchar>
#include <iconv.h>
#endif`);
        lines.push(`using namespace ${namespace};`);
        lines.push(`unsigned int StringUtil::GetLocale() {`);
        lines.push(`#ifdef _MSC_VER`);
        lines.push(`    return GetACP();`);
        lines.push(`#elif __linux__`);
        lines.push(`    return 65001;`);
        lines.push(`#endif`);
        lines.push(`}`);

        lines.push(`std::string StringUtil::To(const std::string &value, unsigned int fromCodePage, unsigned int toCodePage) {`);
        lines.push(`#ifdef _MSC_VER
	int length = MultiByteToWideChar(fromCodePage, 0, value.c_str(), -1, NULL, 0);
	wchar_t* wchars = new wchar_t[length + 1];
	memset(wchars, 0, length * 2 + 2);
	MultiByteToWideChar(fromCodePage, 0, value.c_str(), -1, wchars, length);
	length = WideCharToMultiByte(toCodePage, 0, wchars, -1, NULL, 0, NULL, NULL);
	char* str = new char[length + 1];
	memset(str, 0, length + 1);
	WideCharToMultiByte(toCodePage, 0, wchars, -1, str, length, NULL, NULL);
	std::string strTemp(str);
	if (wchars) delete[] wchars;
	if (str) delete[] str;
	return strTemp;
#else
	std::string result;

	iconv_t converter = iconv_open(std::to_string(toCodePage).c_str(), std::to_string(fromCodePage).c_str());

	if (converter == (iconv_t)-1) {
		std::cout << "Failed to open converter." << std::endl;
		return result;
	}

	size_t inBytesLeft = value.size();
	size_t outBytesLeft = value.size() * 4;

	char* inBuf = const_cast<char*>(value.data());
	char* outBuf = new char[outBytesLeft];
	char* outBufStart = outBuf;

	if (iconv(converter, &inBuf, &inBytesLeft, &outBuf, &outBytesLeft) == (size_t)-1) {
		std::cout << "Failed to convert the string." << std::endl;
	}
	else {
		result.assign(outBufStart, outBytesLeft - outBytesLeft);
		std::cout << "Conversion successful." << std::endl;
	}

	delete[] outBufStart;
	iconv_close(converter);

	return result;
#endif`);
        lines.push(`}`);

        lines.push(`std::string StringUtil::To(const wchar_t *value, unsigned int toCodePage) {`);
        lines.push(`#ifdef _MSC_VER
	int length = WideCharToMultiByte(toCodePage, 0, value, -1, SUPPORT_NULLPTR, 0, SUPPORT_NULLPTR, SUPPORT_NULLPTR);
	if (length == 0) {
		return std::string();
	}
	std::string result(length - 1, '\\0');
	WideCharToMultiByte(toCodePage, 0, value, -1, &result[0], length, SUPPORT_NULLPTR, SUPPORT_NULLPTR);
	return result;
#elif __linux__
	std::string result;
	iconv_t conv = iconv_open(std::to_string(toCodePage).c_str(), "wchar_t");
	if (conv == (iconv_t)-1) {
		return result;
	}
	size_t inSize = wcslen(value) * sizeof(wchar_t);
	size_t inBytesLeft = inSize;
    
	size_t outSize = inSize * 2;
	size_t outBytesLeft = outSize;
    
	char* outBuffer = new char[outSize];
	char* outPtr = outBuffer;

	const char* inPtr = reinterpret_cast<const char*>(value);
	if (iconv(conv, &inPtr, &inBytesLeft, &outPtr, &outBytesLeft) == (size_t)-1) {
    
		delete[] outBuffer;
		iconv_close(conv);
		return result;
	}
    
	result.assign(outBuffer, outSize - outBytesLeft);

	delete[] outBuffer;
	iconv_close(conv);

	return result;
#else
	return "";
#endif`);
        lines.push(`}`);

        lines.push(`#if SUPPORT_STD_WSTRING
std::wstring StringUtil::To(const std::string &value, unsigned int fromCodePage) {
        int length = MultiByteToWideChar(fromCodePage, 0, value.c_str(), -1, NULL, 0);
if (length == 0)
{
	return L"";
}

std::wstring result(length - 1, L'\\0');
if (MultiByteToWideChar(fromCodePage, 0, value.c_str(), -1, &result[0], length) == 0)
{
	return L"";
}

return result;
}
#endif`);
        classes.push({
            FileName: `${namespace}_StringUtil.cpp`,
            Content: lines.join('\r\n')
        });
        return classes;
    };

    let generateStringClasses = () => {
        let targetEncodings = [0, 65001, 936];
        let classNames = ['LocaleString', 'UTF8String', 'GBKString'];
        let files = [] as any;
        generateStringUtilClass(config.namespace, config.exportDefine).forEach((item) => {
            files.push(item);
        });
        generateStringCommonClass(config.namespace).forEach((item) => {
            files.push(item);
        });
        for (let i = 0; i < targetEncodings.length; i++) {
            let targetEncoding = targetEncodings[i];
            let className = classNames[i];
            let result = generateStringClass(config.namespace, className, targetEncoding, config.exportDefine, classNames);
            result.forEach(item => {
                files.push(item);
            });
        }
        return files;
    };

    let generateTimeSpanClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_TIMESPAN_H__
#define __${namespace.toUpperCase()}_TIMESPAN_H__
#include "${namespace}_UTF8String.h"

#ifndef NOTSUPPORT_CHRONO
#if defined(_MSC_VER) && _MSC_VER <= 1800
#define NOTSUPPORT_CHRONO 1
#else
#define NOTSUPPORT_CHRONO 0
#include <chrono>
#endif
#endif
namespace ${namespace}
{
	class ${exportDefine} TimeSpan
	{
	public:
#if NOTSUPPORT_CHRONO
		TimeSpan(long long target);
#else
		TimeSpan(std::chrono::system_clock::duration target);
#endif

		TimeSpan(double hour, double minute, double second);

		TimeSpan(double day, double hour, double minute, double second);

#if NOTSUPPORT_CHRONO
		long long Target;
#else
		std::chrono::system_clock::duration Target;
#endif

		double TotalSeconds();

		double TotalMilliseconds();

		double TotalMicroseconds();
        
		long long Ticks();
        
		UTF8String ToString();

	private:
    
		static void Join(UTF8String &result, double &total, long long limit, UTF8String unit);
	};
}
#endif`;
        let source = `#include "${namespace}_TimeSpan.h"
using namespace ${namespace};
#if NOTSUPPORT_CHRONO
TimeSpan::TimeSpan(long long target)
{
	this->Target = target;
}
#else
TimeSpan::TimeSpan(std::chrono::system_clock::duration target)
{
    this->Target = target;
}
#endif

TimeSpan::TimeSpan(double hour, double minute, double second)
{
#if NOTSUPPORT_CHRONO
	this->Target = (long long)(
		hour * 60 * 60 +
		minute * 60 +
		second
    );
#else
    this->Target = std::chrono::system_clock::duration((long long)(
        hour * 60 * 60 * 1000 * 10000 +
        minute * 60 * 1000 * 10000 +
        second * 1000 * 10000
        ));
#endif
}

TimeSpan::TimeSpan(double day, double hour, double minute, double second)
{
#if NOTSUPPORT_CHRONO
	this->Target = (long long)(
		day * 24 * 60 * 60 +
		hour * 60 * 60 +
		minute * 60 +
		second
		);
#else
    this->Target = std::chrono::system_clock::duration((long long)(
        day * 24 * 60 * 60 * 1000 * 10000 +
        hour * 60 * 60 * 1000 * 10000 +
        minute * 60 * 1000 * 10000 +
        second * 1000 * 10000
        ));
#endif
}

double TimeSpan::TotalSeconds()
{
#if NOTSUPPORT_CHRONO
	return Target;
#else
    return Target.count() / 10000000.0;
#endif
}

double TimeSpan::TotalMilliseconds()
{
#if NOTSUPPORT_CHRONO
    return Target * 1000;
#else
    return Target.count() / 10000.0;
#endif
}

double TimeSpan::TotalMicroseconds()
{
#if NOTSUPPORT_CHRONO
    return Target * 1000 * 1000;
#else
	return Target.count() / 10.0;
#endif
}

long long TimeSpan::Ticks()
{
#if NOTSUPPORT_CHRONO
	return Target;
#else
    return Target.count();
#endif
}

UTF8String TimeSpan::ToString()
{
    static long long yearLimit = (long long)365 * 24 * 60 * 60 * 1000;
    static long long monthLimit = (long long)30 * 24 * 60 * 60 * 1000;
    static long long dayLimit = (long long)24 * 60 * 60 * 1000;
    static long long hourLimit = (long long)60 * 60 * 1000;
    static long long minuteLimit = (long long)60 * 1000;
    static long long secondLimit = (long long)1000;
    double total = TotalMilliseconds();
    UTF8String result;
    Join(result, total, yearLimit, LocaleString("Year"));
    Join(result, total, monthLimit, LocaleString("Month"));
    Join(result, total, dayLimit, LocaleString("Day"));
    Join(result, total, hourLimit, LocaleString("h"));
    Join(result, total, minuteLimit, LocaleString("m"));
    Join(result, total, secondLimit, LocaleString("s"));
    if (total > 0)
    {
        result.Append(total);
        result.Append(LocaleString("ms"));
    }
    return result;
}

void TimeSpan::Join(UTF8String& result, double& total, long long limit, UTF8String unit)
{
    if (total > limit)
    {
        int count = (int)(total / limit);
        result.Append(count);
        result.Append(unit);
        total = total - count * limit;
    }
}
`;
        return [{
            FileName: `${namespace}_TimeSpan.h`,
            Content: header
        }, {
            FileName: `${namespace}_TimeSpan.cpp`,
            Content: source
        }];
    };

    let generateDateTimeClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_DATETIME_H__
#define __${namespace.toUpperCase()}_DATETIME_H__
#include <ctime>
#include "${namespace}_UTF8String.h"
#ifndef NOTSUPPORT_CHRONO
#if defined(_MSC_VER) && _MSC_VER <= 1800
#define NOTSUPPORT_CHRONO 1

#else
#define NOTSUPPORT_CHRONO 0
#include <chrono>
#endif
#endif
namespace ${namespace}
{
	class ${exportDefine} DateTimeInfomation
	{
	public:
		DateTimeInfomation()
		{
			Year = 0;
			Month = 0;
			Day = 0;
			Week = 0;
			Hour = 0;
			Minute = 0;
			Second = 0;
		}
		int Year;
		int Month;
		int Day;
		int Week;
		int Hour;
		int Minute;
		int Second;
	};

	class TimeSpan;
	class ${exportDefine} DateTime
	{
	public:
		DateTime()
		{
#if NOTSUPPORT_CHRONO
			Target = time_t();
#else
			Target = std::chrono::system_clock::now();
#endif
		}

		DateTime(time_t target)
		{
#if NOTSUPPORT_CHRONO
			this->Target = target;
#else
			this->Target = std::chrono::system_clock::from_time_t(target);
#endif
		}

#if NOTSUPPORT_CHRONO
#else
		DateTime(std::chrono::system_clock::time_point target)
		{
			this->Target = target;
		}
#endif
		

		DateTime(int year, int month, int day, int hour, int minute, int second)
		{
			std::time_t timeLong;
			std::time(&timeLong);
			std::tm localTime = *std::localtime(&timeLong);
			localTime.tm_year = year - 1900;
			localTime.tm_mon = month - 1;
			localTime.tm_mday = day;
			localTime.tm_hour = hour;
			localTime.tm_min = minute;
			localTime.tm_sec = second;
#if NOTSUPPORT_CHRONO
			this->Target = std::mktime(&localTime);
#else
			this->Target = std::chrono::time_point<std::chrono::system_clock>(std::chrono::duration<long long, std::ratio<1, 1>>(std::mktime(&localTime)));
#endif	
		}

#if NOTSUPPORT_CHRONO
		std::time_t Target;
#else
		std::chrono::system_clock::time_point Target;
#endif

		std::time_t time_t()
		{
#if NOTSUPPORT_CHRONO
			return Target;
#else
			return std::chrono::system_clock::to_time_t(Target);
#endif
		}

		std::tm LocalTime()
		{
			std::time_t temp = time_t();
			return *std::localtime(&temp);
		}

		std::tm UTCTime()
		{
			std::time_t temp = time_t();
			return *std::gmtime(&temp);
		}

		static DateTime Now()
		{
#if NOTSUPPORT_CHRONO
			return DateTime(std::time(SUPPORT_NULLPTR));
#else
			return DateTime(std::chrono::system_clock::now());
#endif
		}

		static long long GetMillisecondsSinceMidnight();

		DateTimeInfomation Infomation()
		{
			DateTimeInfomation result;
			std::tm time = LocalTime();
			result.Year = 1900 + time.tm_year;
			result.Month = 1 + time.tm_mon;
			result.Day = time.tm_mday;
			result.Week = time.tm_wday;
			result.Hour = time.tm_hour;
			result.Minute = time.tm_min;
			result.Second = time.tm_sec;
			return result;
		}

		int Year()
		{
			return Infomation().Year;
		}

		int Month()
		{
			return Infomation().Month;
		}

		int Day()
		{
			return Infomation().Day;
		}

		int Week()
		{
			return Infomation().Week;
		}

		int Hour()
		{
			return Infomation().Hour;
		}

		int Minute()
		{
			return Infomation().Minute;
		}

		int Second()
		{
			return Infomation().Second;
		}

		DateTime AddMilliseconds(double value);

		DateTime AddSeconds(double value);

		DateTime AddMinutes(double value);

		DateTime AddHours(double value);

		DateTime AddDays(double value);

		DateTime AddWeeks(double value);

		UTF8String ToString(UTF8String format = "yyyy/MM/dd HH:mm:ss");

		TimeSpan operator-(const DateTime &right);

		DateTime operator+(const TimeSpan &right);
	};
}
#endif`;
        let source = `
#include "${namespace}_DateTime.h"
#include "${namespace}_TimeSpan.h"
using namespace ${namespace};

long long DateTime::GetMillisecondsSinceMidnight()
{
#if NOTSUPPORT_CHRONO
	SYSTEMTIME st;
	GetLocalTime(&st);
	return st.wHour * 60 * 60 * 1000 + st.wMinute * 60 * 1000 + st.wSecond * 1000 + st.wMilliseconds;
#else
	auto now = std::chrono::system_clock::now();
	auto current_date = std::chrono::system_clock::to_time_t(now);
	struct std::tm* time_info = std::localtime(&current_date);
	time_info->tm_hour = 0;
	time_info->tm_min = 0;
	time_info->tm_sec = 0;
	auto midnight = std::chrono::system_clock::from_time_t(std::mktime(time_info));
	auto milliseconds_since_midnight = std::chrono::duration_cast<std::chrono::milliseconds>(now - midnight).count();
	return milliseconds_since_midnight;
#endif
}

DateTime DateTime::AddMilliseconds(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)(value / 1000);
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)10000));
#endif
}

DateTime DateTime::AddSeconds(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)value;
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)10000000));
#endif
	
}

DateTime DateTime::AddMinutes(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)(value * 60);
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)60 * 10000000));
#endif
	
}

DateTime DateTime::AddHours(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)(value * 60 * 60);
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)60 * 60 * 10000000));
#endif
}

DateTime DateTime::AddDays(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)(value * 24 * 60 * 60);
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)24 * 60 * 60 * 10000000));
#endif
}

DateTime DateTime::AddWeeks(double value)
{
#if NOTSUPPORT_CHRONO
	return Target + (long long)(value * 7 * 24 * 60 * 60);
#else
	return Target + std::chrono::system_clock::time_point::duration((long long)(value * (long long)7 * 24 * 60 * 60 * 10000000));
#endif
}

UTF8String DateTime::ToString(UTF8String format)
{
	DateTimeInfomation Info = Infomation();
	return format.
		Replace("yyyy", Info.Year).
		Replace("MM", UTF8String(Info.Month).FillStart(2, "0")).
		Replace("dd", UTF8String(Info.Day).FillStart(2, "0")).
		Replace("HH", UTF8String(Info.Hour).FillStart(2, "0")).
		Replace("mm", UTF8String(Info.Minute).FillStart(2, "0")).
		Replace("ss", UTF8String(Info.Second).FillStart(2, "0"));
}

TimeSpan DateTime::operator-(const DateTime& right)
{
	return Target - right.Target;
}

DateTime DateTime::operator+(const TimeSpan& right)
{
	return Target + right.Target;
}
`;
        return [{
            FileName: `${namespace}_DateTime.h`,
            Content: header
        }, {
            FileName: `${namespace}_DateTime.cpp`,
            Content: source
        }];
    };

    let generateIDClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_ID_H__
#define __${namespace.toUpperCase()}_ID_H__
#include "${namespace}_UTF8String.h"
namespace ${namespace} {
class ${exportDefine} ID
{
public:
    static UTF8String GenerateID(const UTF8String &base, int length);

    static UTF8String GenerateID(int length);

    static UTF8String ConvertToID(SUPPORT_INT64 value);
    
    static UTF8String GeneratePathName();
    
    static UTF8String GenerateGUID();
};
}
#endif`;

        let source = `#include "${namespace}_ID.h"
#include <iostream>
#include <random>
#include "${namespace}_DateTime.h"
#ifdef _MSC_VER
#include <iomanip>
#include <windows.h>
#else
#include <uuid/uuid.h>
#endif // _MSC_VER

namespace ${namespace} {
	UTF8String ID::GenerateID(const UTF8String& base, int length)
	{
#if _MSC_VER <= 1500
		UTF8String result;
		for (int i = 0; i < length; i++) {
			result.Append(base[rand() % base.Length()]);
		}
		return result;
#else

		static std::mt19937 gen(std::random_device{}());
		std::uniform_int_distribution<> dist(0, base.Length() - 1);
		UTF8String result;
		for (int i = 0; i < length; i++) {
			result.Append(base[dist(gen)]);
		}
		return result;
#endif
		
	}

	UTF8String ID::GenerateID(int length)
	{
		static UTF8String base = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return GenerateID(base,length);
	}

	UTF8String ID::ConvertToID(SUPPORT_INT64 value)
	{
		static UTF8String base = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return UTF8String(value,base);
	}

	UTF8String ID::GeneratePathName()
	{
		return GenerateID(4);
	}

	UTF8String ID::GenerateGUID()
	{
#ifdef _MSC_VER
		GUID guid;
		CoCreateGuid(&guid);

		std::stringstream ss;
		ss << std::hex
			<< std::setfill('0') << std::setw(8) << guid.Data1
			<< "-"
			<< std::setfill('0') << std::setw(4) << guid.Data2
			<< "-"
			<< std::setfill('0') << std::setw(4) << guid.Data3
			<< "-"
			<< std::setfill('0') << std::setw(2);
		for (int i = 0; i < 8; i++) {
			ss << std::hex << static_cast<int>(guid.Data4[i]);
		}

		return ss.str();
#else
		uuid_t uuid;
		uuid_generate(uuid);

		char uuid_str[37];
		uuid_unparse(uuid, uuid_str);

		return uuid_str;
#endif
	}
}

`;
        return [{
            FileName: `${namespace}_ID.h`,
            Content: header
        }, {
            FileName: `${namespace}_ID.cpp`,
            Content: source
        }];
    };

    let generate = () => {
        let classes = [] as {
            FileName: string,
            Content: string
        }[];
        generateStringClasses().forEach((item) => {
            classes.push(item);
        });
        generateTimeSpanClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateDateTimeClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateIDClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        return classes;
    };

    return {
        generate
    };
};

let generator = TidyCppGenerator({
    namespace: "Tidy",
    exportDefine: ""
});
let classes = generator.generate();
for (let classFile of classes) {
    File.WriteAllText(classFile.FileName, classFile.Content);
}