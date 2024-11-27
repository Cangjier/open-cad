import { File } from "../.tsc/System/IO/File";
import { Directory } from "../.tsc/System/IO/Directory";
import { Console } from "../.tsc/System/Console";
import { Path } from "../.tsc/System/IO/Path";
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
        #ifndef NULL
            #define NULL 0
        #endif
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
    let generateMacro = () => {
        let header = `
#ifndef __${config.namespace.toUpperCase()}_MACRO_H__
#define __${config.namespace.toUpperCase()}_MACRO_H__
headerLines.push(generate_SUPPORT_NULLPTR());
${generate_SUPPORT_STD_STRINGSTREAM()}
${generate_SUPPORT_EXPLICIT()}
${generate_SUPPORT_INT64()}
${generate_SUPPORT_STD_OSTRINGSTREAM()}
${generate_SUPPORT_STD_WSTRING()}
${generate_SUPPORT_RVALUE_REFERENCES()}
${generate_SUPPORT_STD_FUNCTION()}
#endif
        `;
        return [
            {
                FileName: `${config.namespace}_Macro.h`,
                Content: header
            }
        ]
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
        headerLines.push(`#include "${namespace}_Macro.h"`);
        headerLines.push(`#include <string>`);
        headerLines.push(`#include <vector>`);
        headerLines.push(`#include "${namespace}_StringUtil.h"`);
        headerLines.push(`#include "${namespace}_StringCommon.h"`);

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
        lines.push(`
#include "${namespace}_Macro.h"
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
        files.push({
            FileName: `${config.namespace}_String.h`,
            Content: `#include "${config.namespace}_LocaleString.h"
#include "${config.namespace}_UTF8String.h"
#include "${config.namespace}_GBKString.h"`
        });
        return files;
    };

    let generateTimeSpanClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_TIMESPAN_H__
#define __${namespace.toUpperCase()}_TIMESPAN_H__
#include "${namespace}_Macro.h"
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
#include "${namespace}_Macro.h"
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
#include "${namespace}_Macro.h"
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

    let generateBytesClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_BYTES_H__
#define __${namespace.toUpperCase()}_BYTES_H__
#include "${namespace}_Macro.h"
${generate_SUPPORT_NULLPTR()}
namespace ${namespace}
{
  class ${exportDefine} Bytes
  {
  public:
    Bytes(){
        Target = SUPPORT_NULLPTR;
        Length = 0;
    }
    
    Bytes(unsigned char *target, size_t length){
        Target = target;
        Length = length;
    }

    static Bytes New(size_t length) {
        return Bytes(new unsigned char[length], length);
    }

    unsigned char *Target;
    
    size_t Length;
    
    void Release(){
        if(Target != SUPPORT_NULLPTR){
            delete[] Target;
            Target = SUPPORT_NULLPTR;
        }
    }
    
    bool IsNullOrEmpty(){
        return Target == SUPPORT_NULLPTR || Length == 0;
    }
  };
}
#endif`;

        return [{
            FileName: `${namespace}_Bytes.h`,
            Content: header
        }];
    };

    let generateEncodingClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_ENCODING_H__
#define __${namespace.toUpperCase()}_ENCODING_H__
#include "${namespace}_Macro.h"
namespace ${namespace}
{
    class UTF8String;
    class ${exportDefine} Encoding
    {
    public:
        Encoding();

        Encoding(unsigned int Target);

        unsigned int Target;

    public:
        UTF8String Name();
        
        bool operator==(const Encoding &other) const
        {
            return Target == other.Target;
        }

        operator unsigned int() const
        {
            return Target;
        }

    public:
    
        static Encoding UTF8;
        
        static Encoding Locale;
        
        static Encoding GBK;
    };
}
#endif`;

        let source = `
#include "${namespace}_Encoding.h"
#include "${namespace}_UTF8String.h"
using namespace ${namespace};

Encoding Encoding::UTF8 = 65001;
Encoding Encoding::Locale = 0;
Encoding Encoding::GBK = 936;

Encoding::Encoding()
{
	this->Target = 65001;
}

Encoding::Encoding(unsigned int Target)
{
	this->Target = Target;
}

UTF8String Encoding::Name()
{
	switch (Target)
	{
	case 0:
		return "Locale";
	case 65001:
		return "UTF8";
	case 936:
		return "GBK";
	default:
		return "Unknown";
	}
}

`;

        return [{
            FileName: `${namespace}_Encoding.h`,
            Content: header
        }, {
            FileName: `${namespace}_Encoding.cpp`,
            Content: source
        }];
    };

    let generateFileClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_IO_FILE_H__
#define __${namespace.toUpperCase()}_IO_FILE_H__
#include "${namespace}_Macro.h"
#include <vector>
#include <map>
#include "${namespace}_LocaleString.h"
#include "${namespace}_UTF8String.h"
#include "${namespace}_GBKString.h"
#include "${namespace}_Bytes.h"
#include "${namespace}_IO_FileInfo.h"
#include "${namespace}_Encoding.h"

namespace ${namespace}
{
    namespace IO
    {
        class Path;
        class Directory;

        class ${exportDefine} File
        {
        public:
            static bool Exists(LocaleString path);
            
            static void Copy(LocaleString sourcePath, LocaleString destPath);
            
            static void Copy(LocaleString sourcePath, LocaleString destPath, bool overwrite);

            static void Delete(LocaleString path);
            
            static void CreateEmptyFile(LocaleString path);
            
            static std::string ReadAllText(LocaleString path);
            
            static UTF8String ReadAllText(LocaleString path, const Encoding& encoding);
            
            static Bytes ReadAllBytes(LocaleString path);
            
            static bool WriteAllText(LocaleString path, const std::string& contents);
            
            static bool WriteAllText(LocaleString path, const UTF8String& contents, const Encoding& encoding);
            
            static std::vector<std::string> ReadAllLines(LocaleString path);
            
            static std::vector<UTF8String> ReadAllLines(LocaleString path, const Encoding& encoding);
            
            static void WriteAllLines(LocaleString path, const std::vector<std::string>& lines);
            
            static void WriteAllLines(LocaleString path, const std::vector<UTF8String>& lines, const Encoding& encoding);
            
            static bool AppendAllText(LocaleString path, const std::string& contents);
            
            static bool AppendAllText(LocaleString path, const UTF8String& contents, const Encoding& encoding);
        };
    }
}
#endif`;
        let source = `#include <fstream>
#include <iostream>
#include <fstream>
#include "${namespace}_IO_File.h"
#include "${namespace}_IO_Path.h"
#include "${namespace}_IO_Directory.h"

using namespace ${namespace};
using namespace IO;

bool File::Exists(LocaleString path)
{
#ifdef _MSC_VER
#if _MSC_VER <= 1800
	WIN32_FIND_DATA findFileData;
	HANDLE hFind = FindFirstFile(path.ToWString().c_str(), &findFileData);

	if (hFind != INVALID_HANDLE_VALUE) {
		FindClose(hFind);
		return true;
	}
	return false;
#else
	struct stat Buffer;
	return (stat(path.ToChars(), &Buffer) == 0);
#endif

#else
	return false;
#endif //_MSC_VER
}

void IO::File::Copy(LocaleString sourcePath, LocaleString destPath)
{
	std::ifstream source(sourcePath.Target.c_str(), std::ios::binary);
	std::ofstream dest(destPath.Target.c_str(), std::ios::binary);

	if (source && dest)
	{
		dest << source.rdbuf();
	}
}

void IO::File::Copy(LocaleString sourcePath, LocaleString destPath, bool overwrite)
{
	if (!overwrite && std::ifstream(destPath.Target.c_str()))
	{
		return;
	}
	Copy(sourcePath, destPath);
}

void IO::File::Delete(LocaleString path)
{
	if (std::remove(path.Target.c_str()) == 0)
	{
		std::cout << "File deleted successfully." << std::endl;
	}
	else
	{
		std::cerr << "Failed to delete file." << std::endl;
	}
}

void IO::File::CreateEmptyFile(LocaleString path)
{
	std::ofstream file(path.Target.c_str());
	if (!file)
	{
		std::cerr << "Failed to create file." << std::endl;
	}
	file.close();
}

std::string IO::File::ReadAllText(LocaleString path)
{
	std::ifstream file(path.Target.c_str());
	if (file)
	{
		std::string contents((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
		return contents;
	}
	else
	{
		std::cerr << "Failed to read file." << std::endl;
		return "";
	}
}

UTF8String IO::File::ReadAllText(LocaleString path, const Encoding& encoding)
{
	if (encoding != Encoding::UTF8) {
		return StringUtil::To(ReadAllText(path), encoding, Encoding::UTF8);
	}
	else {
		return ReadAllText(path);
	}
}

Bytes IO::File::ReadAllBytes(LocaleString path)
{
	std::ifstream file(path.Target.c_str(), std::ios::binary);
	if (!file.is_open()) {
		return Bytes();
	}
	file.seekg(0, std::ios::end);
	std::streampos fileSize = file.tellg();
	file.seekg(0, std::ios::beg);
	unsigned char* data= new unsigned char[fileSize];
	file.read(reinterpret_cast<char*>(data), fileSize);
	Tidy::Bytes bytes(data, static_cast<std::size_t>(fileSize));
	file.close();
	return bytes;
}

bool IO::File::WriteAllText(LocaleString path, const std::string& contents)
{
	std::ofstream file(path.Target.c_str());
	if (file)
	{
		file << contents;
		return true;
	}
	else
	{
		return false;
	}
}

bool IO::File::WriteAllText(LocaleString path, const UTF8String& contents, const Encoding& encoding)
{
	if (encoding != Encoding::UTF8) {
		return WriteAllText(path, StringUtil::To(contents.Target, Encoding::UTF8, encoding));
	}
	else {
		return WriteAllText(path, contents.Target);
	}
}

std::vector<std::string> IO::File::ReadAllLines(LocaleString path)
{
	std::vector<std::string> lines;
	std::ifstream file(path.Target.c_str());
	if (file)
	{
		std::string line;
		while (std::getline(file, line))
		{
			lines.push_back(line);
		}
	}
	else
	{
		std::cerr << "Failed to read file." << std::endl;
	}
	return lines;
}

std::vector<UTF8String> IO::File::ReadAllLines(LocaleString path, const Encoding& encoding)
{
	std::vector<UTF8String> lines;
	std::ifstream file(path.Target.c_str());
	if (file)
	{
		std::string line;
		while (std::getline(file, line))
		{
			if (encoding != Encoding::UTF8) {
				lines.push_back(StringUtil::To(line, encoding.Target, Encoding::UTF8.Target));
			}
			else
			{
				lines.push_back(line);
			}
		}
	}
	else
	{
		std::cerr << "Failed to read file." << std::endl;
	}
	return lines;
}

void IO::File::WriteAllLines(LocaleString path, const std::vector<std::string>& lines)
{
	std::ofstream file(path.Target.c_str());
	if (file)
	{
        for(size_t i = 0; i < lines.size(); i++)
        {
            file << lines[i];
            if(i != lines.size() - 1)
            {
                file << std::endl;
            }
        }
	}
	else
	{
		std::cerr << "Failed to write file." << std::endl;
	}
}

void IO::File::WriteAllLines(LocaleString path, const std::vector<UTF8String>& lines, const Encoding& encoding)
{
	std::ofstream file(path.Target.c_str());
	if (file)
	{
        for(size_t i = 0; i < lines.size(); i++)
        {
            if (encoding != Encoding::UTF8) {
                file << StringUtil::To(lines[i].Target, Encoding::UTF8.Target, encoding.Target) << std::endl;
            }
            else {
                file << lines[i].Target << std::endl;
            }
        }
	}
	else
	{
		std::cerr << "Failed to write file." << std::endl;
	}
}

bool IO::File::AppendAllText(LocaleString path, const std::string& contents)
{
	std::ofstream file(path.Target.c_str(), std::ios::app);
	if (file)
	{
		file << contents;
		return true;
	}
	else
	{
		return false;
	}
}

bool IO::File::AppendAllText(LocaleString path, const UTF8String& contents, const Encoding& encoding)
{
	std::ofstream file(path.Target.c_str(), std::ios::app);
	if (file)
	{
		if (encoding != Encoding::UTF8) {
			file << StringUtil::To(contents.Target, Encoding::UTF8, encoding);
		}
		else {
			file << contents.Target;
		}
		return true;
	}
	else
	{
		return false;
	}
}
`;

        return [{
            FileName: `${namespace}_IO_File.h`,
            Content: header
        }, {
            FileName: `${namespace}_IO_File.cpp`,
            Content: source
        }];
    };

    let generateFileInfoClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_IO_FILEINFO_H__
#define __${namespace.toUpperCase()}_IO_FILEINFO_H__
#include "${namespace}_Macro.h"
#include "${namespace}_LocaleString.h"
#include "${namespace}_DateTime.h"
namespace ${namespace}
{
	namespace IO
	{
		class DirectoryInfo;
		class ${exportDefine} FileAttributes
		{
		public:
#ifndef ${namespace}_IO_File_RegisterAttribute
#define ${namespace}_IO_File_RegisterAttribute(Name, NameStr) \\
	LocaleString Get##Name() { return ReadAttribute(NameStr); }
#endif // !${namespace}_IO_File_RegisterAttribute

			FileAttributes(LocaleString Target)
			{
				this->Target = Target;
			}

			LocaleString Target;

			LocaleString ReadAttribute(LocaleString Name);
			${namespace}_IO_File_RegisterAttribute(CompanyName, "CompanyName");
			${namespace}_IO_File_RegisterAttribute(FileDescription, "FileDescription");
			${namespace}_IO_File_RegisterAttribute(FileVersion, "FileVersion");
			${namespace}_IO_File_RegisterAttribute(InternalName, "InternalName");
			${namespace}_IO_File_RegisterAttribute(LegalCopyright, "LegalCopyright");
			${namespace}_IO_File_RegisterAttribute(OriginalFilename, "OriginalFilename");
			${namespace}_IO_File_RegisterAttribute(ProductName, "ProductName");
			${namespace}_IO_File_RegisterAttribute(ProductVersion, "ProductVersion");
			${namespace}_IO_File_RegisterAttribute(Comments, "Comments");
			${namespace}_IO_File_RegisterAttribute(LegalTrademarks, "LegalTrademarks");
		};
		class ${exportDefine} FileInfo
		{
		public:
			FileInfo();
			FileInfo(LocaleString target);

			LocaleString Target;

		public:
			DirectoryInfo Parent();

			LocaleString Name();

			LocaleString Extension();

			LocaleString NameWithoutExtension();
            
			int Size();

			FileAttributes Attributes()
			{
				return FileAttributes(Target);
			}

			void ReName(LocaleString name);

			void MoveTo(LocaleString destPath);

			void Delete();

			void CopyTo(LocaleString destPath);

			DateTime GetLastModifiedTime();
		};
	}
}
#endif`;
        let source = `
#include "${namespace}_IO_FileInfo.h"
#ifdef _MSC_VER
#include <windows.h>
#endif //_MSC_VER
#include <fstream>
#include <iostream>
#include <fstream>
#include "${namespace}_IO_Path.h"
#include "${namespace}_IO_DirectoryInfo.h"

using namespace ${namespace};
using namespace IO;

#ifdef _MSC_VER
time_t FileTimeToTimeT(const FILETIME& ft)
{  
	const ULONGLONG secondsBetween1601And1970 = 11644473600ULL;
	const ULONGLONG hundredNanosInSecond = 10000000ULL;

	ULARGE_INTEGER fileTimeInteger;
	fileTimeInteger.LowPart = ft.dwLowDateTime;
	fileTimeInteger.HighPart = ft.dwHighDateTime;
     
	ULARGE_INTEGER timeTInteger;
	timeTInteger.QuadPart = (fileTimeInteger.QuadPart / hundredNanosInSecond) - secondsBetween1601And1970;

	return static_cast<time_t>(timeTInteger.QuadPart);
}
#endif

FileInfo::FileInfo()
{
	Target = "";
}

FileInfo::FileInfo(LocaleString target)
{
	Target = target;
}

LocaleString FileAttributes::ReadAttribute(LocaleString name)
{
	LocaleString result;
#ifdef _MSC_VER
	DWORD Handle;
	DWORD Size = GetFileVersionInfoSizeA((LPCSTR)Target.ToChars(), &Handle);
	if (Size == 0)return "";
	BYTE* VersionData = new BYTE[Size];
	GetFileVersionInfoA((LPCSTR)Target.ToChars(), Handle, Size, (void*)VersionData);
	UINT QuerySize;
	DWORD* TransTable;
	if (!VerQueryValueA(VersionData, "\\\\VarFileInfo\\\\Translation", (void**)&TransTable, &QuerySize))
	{
		return "";
	}
	DWORD CharSet = MAKELONG(HIWORD(TransTable[0]), LOWORD(TransTable[0]));
	char Tmp[256];
	sprintf_s(Tmp, 256, "\\\\StringFileInfo\\\\%08lx\\\\%s", CharSet, name.ToChars());
	LPVOID Data;
	if (!VerQueryValueA((void*)VersionData, Tmp, &Data, &QuerySize))
	{
		result = (char*)Data;
	}
	delete[] VersionData;
#endif //_MSC_VER

	return result;
}

DirectoryInfo FileInfo::Parent()
{
	return DirectoryInfo(Path::GetDirectoryName(Target));
}

LocaleString FileInfo::Name()
{
	return Path::GetFileName(Target);
}

LocaleString FileInfo::Extension()
{
	return Path::GetFileExtension(Target);
}

LocaleString FileInfo::NameWithoutExtension()
{
	return Path::GetFileNameWithoutExtension(Target);
}

int FileInfo::Size()
{
#ifdef _MSC_VER
#if _MSC_VER<=1800
	HANDLE hFile = CreateFileA(Target.ToChars(), GENERIC_READ, 0, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);

	if (hFile == INVALID_HANDLE_VALUE) {
		return 0;
	}

	LARGE_INTEGER fileSize;
	GetFileSizeEx(hFile, &fileSize);
	long long result = fileSize.QuadPart;
	CloseHandle(hFile);
	return result;
#else
	struct stat result;
	if (stat(Target.ToChars(), &result) == 0)
	{
		return  result.st_size;
	}
	else
	{
		return 0;
	}
#endif
	
	
#else
	return 0;
#endif //_MSC_VER

}

void FileInfo::ReName(LocaleString name)
{
	MoveTo(Path::ReFileName(Target,name));
}

void FileInfo::MoveTo(LocaleString destPath)
{
#ifdef _MSC_VER
	if (rename(Target.ToChars(), destPath.ToChars()) != 0)
	{
		//error
	}
#endif //_MSC_VER
}

void FileInfo::Delete()
{
#ifdef _MSC_VER
	if (remove(Target.ToChars()) != 0)
	{
		//error
	}
#endif //_MSC_VER
}

void FileInfo::CopyTo(LocaleString DestPath)
{
#ifdef _MSC_VER
	CopyFileA(Target.ToChars(), DestPath.ToChars(), false);
#endif //_MSC_VER
}

DateTime IO::FileInfo::GetLastModifiedTime()
{
#ifdef _MSC_VER
#if _MSC_VER <= 1800
	HANDLE hFile = CreateFileA(Target.ToChars(), GENERIC_READ, 0, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);

	if (hFile == INVALID_HANDLE_VALUE) {
		return 0;
	}

	FILETIME lastWriteTime;
	GetFileTime(hFile, NULL, NULL, &lastWriteTime);
	CloseHandle(hFile);
	return DateTime(FileTimeToTimeT(lastWriteTime));
#else
	struct stat result;
	if (stat(Target.ToChars(), &result) == 0)
	{
		return DateTime(result.st_mtime);
	}
	else
	{
		return 0;
	}
#endif
#else
	return 0;
#endif //_MSC_VER
}
`;
        return [{
            FileName: `${namespace}_IO_FileInfo.h`,
            Content: header
        }, {
            FileName: `${namespace}_IO_FileInfo.cpp`,
            Content: source
        }];
    };

    let generateDirectoryClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_IO_DIRECTORY_H__
#define __${namespace.toUpperCase()}_IO_DIRECTORY_H__
#include "${namespace}_Macro.h"
#include <vector>
#include "${namespace}_String.h"
#include "${namespace}_IO_DirectoryInfo.h"

namespace ${namespace}
{
    class DateTime;
    namespace IO
    {
        class DirectoryInfo;
        class ${exportDefine} Directory
        {
        public:
            static DirectoryInfo GetParent(LocaleString path);
#undef CreateDirectory
            static DirectoryInfo CreateDirectory(LocaleString path);

            static LocaleString TryCreateDirectory(LocaleString path);
            
            static bool Exists(LocaleString path);
            
            static void SetCreationTime(LocaleString path, DateTime creationTime);
            
            static DateTime GetCreationTime(LocaleString path);
            
            static std::vector<LocaleString> GetFiles(LocaleString path);
            
            static std::vector<LocaleString> GetDirectories(LocaleString path);
            
            static void Move(LocaleString sourceDirName, LocaleString destDirName);
            
            static void Move(LocaleString sourceDirName, LocaleString destDirName, bool recursive);
            
            static void Delete(LocaleString path, bool recursive);
            
            static LocaleString GetDocumentDirectory();
            
            static LocaleString GetUserProfileDirectory();
            
            static LocaleString GetProgramFilesDirectory(int platform);
            
            static LocaleString GetProgramDataDirectory();
            
            static LocaleString GetTemporaryDirectory();
            
            static LocaleString GenerateTemporaryDirectory();
            
            static LocaleString GetModuleDirectory();
        };

    }
}
#endif`;
        let source = `
#include "${namespace}_IO_Directory.h"
#ifdef _MSC_VER
#include "windows.h"
#include <shlobj.h>
#include <direct.h>
#include <io.h>
#endif

#include <stdio.h>
#include "${namespace}_IO_File.h"
#include "${namespace}_IO_Path.h"
#include "${namespace}_IO_DirectoryInfo.h"
#include "${namespace}_DateTime.h"
#include "${namespace}_ID.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <ctime>

using namespace ${namespace};
using namespace IO;

DirectoryInfo Directory::GetParent(LocaleString path)
{
	size_t found = path.Target.find_last_of('/');
	if (found != std::string::npos)
	{
		std::string parentPath = path.Target.substr(0, found);
		return DirectoryInfo(parentPath);
	}
	return DirectoryInfo("");
}
#undef CreateDirectory
DirectoryInfo Directory::CreateDirectory(LocaleString path)
{
	if (CreateDirectoryA(path.Target.c_str(), NULL) != 0)
	{
		return DirectoryInfo(path.Target);
	}
	return DirectoryInfo("");
}

LocaleString IO::Directory::TryCreateDirectory(LocaleString path)
{
	LocaleString parent = Path::GetDirectoryName(path);
	if (!Exists(parent)) {
		TryCreateDirectory(parent);
	}
	if (!Exists(path)) {
		CreateDirectory(path);
	}
	return path;
}

bool Directory::Exists(LocaleString path)
{
	DWORD attributes = GetFileAttributesA(path.Target.c_str());
	return (attributes != INVALID_FILE_ATTRIBUTES && (attributes & FILE_ATTRIBUTE_DIRECTORY));
}

FILETIME _DateTimeToFileTime(DateTime value)
{
	ULARGE_INTEGER uli;
#if NOTSUPPORT_CHRONO
    uli.QuadPart = static_cast<ULONGLONG>(value.Target)*1000*1000*10 + 116444736000000000ULL; // 100 ns intervals from 1/1/1601 to 1/1/1970
#else
	uli.QuadPart = static_cast<ULONGLONG>(value.Target.time_since_epoch().count()) + 116444736000000000ULL; // 100 ns intervals from 1/1/1601 to 1/1/1970
#endif
	FILETIME ft;
	ft.dwLowDateTime = uli.LowPart;
	ft.dwHighDateTime = uli.HighPart;
	return ft;
}

void Directory::SetCreationTime(LocaleString path, DateTime creationTime)
{
	HANDLE hFile = CreateFileA(path.Target.c_str(), FILE_WRITE_ATTRIBUTES, 0, NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL);
	if (hFile != INVALID_HANDLE_VALUE)
	{
		FILETIME ftCreationTime = _DateTimeToFileTime(creationTime);
		SetFileTime(hFile, &ftCreationTime, NULL, NULL);
		CloseHandle(hFile);
	}
}

DateTime Directory::GetCreationTime(LocaleString path)
{
	HANDLE hFile = CreateFileA(path.Target.c_str(), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	DateTime creationTime;
	if (hFile != INVALID_HANDLE_VALUE)
	{
		FILETIME ftCreationTime;
		GetFileTime(hFile, &ftCreationTime, NULL, NULL);
		ULARGE_INTEGER uli;
		uli.LowPart = ftCreationTime.dwLowDateTime;
		uli.HighPart = ftCreationTime.dwHighDateTime;
        #if NOTSUPPORT_CHRONO
            creationTime.Target = (long long)((uli.QuadPart - 116444736000000000ULL)/10000000); // 100 ns intervals from 1/1/1601 to 1/1/1970
        #else
            creationTime.Target = std::chrono::system_clock::time_point(std::chrono::duration<long long, std::ratio<1, 10000000>>(uli.QuadPart - 116444736000000000ULL)); // 100 ns intervals from 1/1/1601 to 1/1/1970
        #endif
		
		CloseHandle(hFile);
	}
	return creationTime;
}

std::vector<LocaleString> Directory::GetFiles(LocaleString path)
{
	std::vector<LocaleString> files;
	WIN32_FIND_DATAA fd;
	HANDLE hFind = FindFirstFileA((path.Target + "\\\\*").c_str(), &fd);
	if (hFind != INVALID_HANDLE_VALUE)
	{
		do
		{
			if ((fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) == 0)
			{
				files.push_back(path.Target + "\\\\" + fd.cFileName);
			}
		} while (FindNextFileA(hFind, &fd));
		FindClose(hFind);
	}
	return files;
}

std::vector<LocaleString> Directory::GetDirectories(LocaleString path)
{
	std::vector<LocaleString> directories;
	WIN32_FIND_DATAA fd;
	HANDLE hFind = FindFirstFileA((path.Target + "\\\\*").c_str(), &fd);
	if (hFind != INVALID_HANDLE_VALUE)
	{
		do
		{
			if ((fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) && (strcmp(fd.cFileName, ".") != 0) && (strcmp(fd.cFileName, "..") != 0))
			{
				directories.push_back(path.Target + "\\\\" + fd.cFileName);
			}
		} while (FindNextFileA(hFind, &fd));
		FindClose(hFind);
	}
	return directories;
}

void Directory::Move(LocaleString sourceDirName, LocaleString destDirName)
{
	MoveFileExA(sourceDirName.Target.c_str(), destDirName.Target.c_str(), MOVEFILE_REPLACE_EXISTING);
}

void Directory::Move(LocaleString sourceDirName, LocaleString destDirName, bool recursive)
{
	MoveFileExA(sourceDirName.Target.c_str(), destDirName.Target.c_str(), MOVEFILE_REPLACE_EXISTING);

	if (recursive)
	{
		std::vector<LocaleString> files = GetFiles(sourceDirName);
        for(size_t i = 0; i < files.size(); i++)
        {
            MoveFileExA(files[i].Target.c_str(), (destDirName + "\\\\" + Path::GetFileName(files[i])).Target.c_str(), MOVEFILE_REPLACE_EXISTING);
        }
		std::vector<LocaleString> directories = GetDirectories(sourceDirName);
        for(size_t i = 0; i < directories.size(); i++){
            Move(directories[i], destDirName + "\\\\" + Path::GetFileName(directories[i]), true);
        }
	}

	
}

void Directory::Delete(LocaleString path, bool recursive)
{
	if (recursive)
	{
		std::vector<LocaleString> files = GetFiles(path);
        for(size_t i = 0; i < files.size(); i++)
        {
            DeleteFileA(files[i].Target.c_str());
        }

		std::vector<LocaleString> directories = GetDirectories(path);
        for(size_t i = 0; i < directories.size(); i++)
        {
            Delete(directories[i], recursive);
        }
	}

	RemoveDirectoryA(path.Target.c_str());
}

LocaleString Directory::GetDocumentDirectory()
{
#ifdef _MSC_VER
#if _MSC_VER <= 1800
    return Path::Combine(GetUserProfileDirectory(), "Documents");
#else
    PWSTR myDocsPath = SUPPORT_NULLPTR;
	if (SHGetKnownFolderPath(FOLDERID_Documents, 0, SUPPORT_NULLPTR, &myDocsPath) == S_OK) {
		std::wstring result(myDocsPath);
		CoTaskMemFree(myDocsPath);
		return result;
	}
	else {
		return "";
	}
#endif
	
#endif
	return "";
}

LocaleString Directory::GetUserProfileDirectory()
{
#ifdef _MSC_VER
	char* documentPath = SUPPORT_NULLPTR;
	if (_dupenv_s(&documentPath, SUPPORT_NULLPTR, "USERPROFILE") == 0 && documentPath != SUPPORT_NULLPTR) {
		std::string path = documentPath;
		free(documentPath);
		return path;
	}
#endif
	return "";
}

LocaleString Directory::GetProgramFilesDirectory(int platform)
{
#ifdef _MSC_VER
	char programFilesPath[MAX_PATH];
	if (platform == 32 || platform == 86) {
		if (SHGetFolderPathA(NULL, CSIDL_PROGRAM_FILESX86, NULL, 0, programFilesPath) == S_OK) {
			return programFilesPath;
		}
		else {
			return "";
		}
	}
	else if (platform == 64) {
		if (SHGetFolderPathA(NULL, CSIDL_PROGRAM_FILES, NULL, 0, programFilesPath) == S_OK) {
			return programFilesPath;
		}
		else {
			return "";
		}
	}
	else{
		return "";
	}
#else
	return "";
#endif
}

LocaleString Directory::GetProgramDataDirectory()
{
#ifdef _MSC_VER
	char programDataPath[MAX_PATH];
	if (SHGetFolderPathA(NULL, CSIDL_COMMON_APPDATA, NULL, 0, programDataPath) == S_OK) {
		return programDataPath;
	}
	else {
		return "";
	}
#else
	return "";
#endif
}

LocaleString Directory::GetTemporaryDirectory()
{
#ifdef _MSC_VER
	char tempPath[MAX_PATH];
	DWORD result = GetTempPathA(MAX_PATH, tempPath);
	if (result > 0 && result < MAX_PATH) {
		char longTempPath[MAX_PATH];
		GetLongPathNameA(tempPath, longTempPath, MAX_PATH);
		return longTempPath;
	}
	else {
		return "";
	}
#endif // _MSC_VER
	return "";

}

LocaleString Directory::GenerateTemporaryDirectory()
{
	LocaleString result = GetTemporaryDirectory() + ID::GeneratePathName();
	CreateDirectory(result);
	return result;
}

LocaleString Directory::GetModuleDirectory()
{
	return Path::GetDirectoryName(Path::GetModulePath());
}
`;

        return [{
            FileName: `${namespace}_IO_Directory.h`,
            Content: header
        }, {
            FileName: `${namespace}_IO_Directory.cpp`,
            Content: source
        }];
    };

    let generateDirectoryInfoClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_IO_DIRECTORYINFO_H__
#define __${namespace.toUpperCase()}_IO_DIRECTORYINFO_H__
#include "${namespace}_Macro.h"
#include "${namespace}_String.h"
namespace ${namespace}
{
    namespace IO
    {
        class FileInfo;
        
        class ${exportDefine} DirectoryInfo
        {
        public:
            DirectoryInfo(LocaleString target);

            LocaleString Target;
            
            void Create();
            
            DirectoryInfo Parent();
            
            bool Exists();
            
            std::vector<FileInfo> GetFiles();
            
            std::vector<FileInfo> GetAllFiles();
            
            std::vector<DirectoryInfo> GetDirectories();
            
            void Delete();
            
            static DirectoryInfo MyDocument();

            LocaleString operator+(LocaleString &right)
            {
                return Target + right;
            }

    private:
            static void GetFiles(LocaleString directory, std::vector<FileInfo> &files);

            static DirectoryInfo Create(LocaleString path);
        };
    }
}

#endif`;
        let source = `
#include "${namespace}_IO_DirectoryInfo.h"

#ifdef _MSC_VER
#include "windows.h"
#include <shlobj.h>
#include <direct.h>
#include <io.h>
#endif

#include <stdio.h>
#include <iostream>
#include "${namespace}_IO_FileInfo.h"
#include "${namespace}_IO_Path.h"

using namespace ${namespace};
using namespace IO;

DirectoryInfo::DirectoryInfo(LocaleString target)
{
	Target = target;
}

DirectoryInfo DirectoryInfo::Create(LocaleString path)
{
	DirectoryInfo result = DirectoryInfo(path);
#ifdef _MSC_VER
	if (mkdir(path.ToChars()) == -1)
	{
		//error
	}
#endif // _MSC_VER
	return result;
}

void DirectoryInfo::Create()
{
	if (!Parent().Exists())
	{
		Parent().Create();
	}
	if (!Exists())
	{
		Create(Target);
	}
}

DirectoryInfo DirectoryInfo::Parent()
{
	return DirectoryInfo(Path::GetDirectoryName(Target));
}

bool DirectoryInfo::Exists()
{
#ifdef _MSC_VER
	DWORD ftyp = GetFileAttributesA(Target.ToChars());
	if (ftyp == INVALID_FILE_ATTRIBUTES)
		return false;  //something is wrong with your path!  

	if (ftyp & FILE_ATTRIBUTE_DIRECTORY)
		return true;   // this is a directory!  
#endif // _MSC_VER
	return false;    // this is not a directory!  
}

std::vector<FileInfo> DirectoryInfo::GetFiles()
{
	std::vector<FileInfo> result;
#ifdef _MSC_VER
	intptr_t hFile = 0;
	struct _finddata_t fileinfo;
	std::string p;
	if ((hFile = _findfirst((Target + "\\\\*").ToChars(), &fileinfo)) != -1)
	{
		while (true)
		{
			if (!(fileinfo.attrib & _A_SUBDIR))
			{
				result.push_back(Target + "\\\\" + fileinfo.name);
			}
			if (_findnext(hFile, &fileinfo) != 0)
			{
				break;
			}
		}
		_findclose(hFile);
	}
#endif // _MSC_VER
	return result;
}

std::vector<FileInfo> DirectoryInfo::GetAllFiles()
{
	std::vector<FileInfo> result;
	GetFiles(Target, result);
	return result;
}

std::vector<DirectoryInfo> DirectoryInfo::GetDirectories()
{
	std::vector<DirectoryInfo> result;
#ifdef _MSC_VER
	intptr_t hFile = 0;
	struct _finddata_t fileinfo;
	std::string p;
	if ((hFile = _findfirst((Target + "\\\\*").ToChars(), &fileinfo)) != -1)
	{
		while (true)
		{
			if ((fileinfo.attrib & _A_SUBDIR) && strcmp(fileinfo.name, ".") != 0 && strcmp(fileinfo.name, "..") != 0)
			{
				result.push_back(Target + "\\\\" + fileinfo.name);
			}
			if (_findnext(hFile, &fileinfo) != 0)
			{
				break;
			}
		}
		_findclose(hFile);
	}
#endif // _MSC_VER
	return result;
}

void DirectoryInfo::Delete()
{
#ifdef _MSC_VER
	RemoveDirectoryA(Target.ToChars());
#endif // _MSC_VER
}

DirectoryInfo DirectoryInfo::MyDocument()
{
#ifdef _MSC_VER
	CHAR my_documents[MAX_PATH];
	HRESULT result = SHGetFolderPathA(NULL, CSIDL_PERSONAL, NULL, SHGFP_TYPE_CURRENT, my_documents);
	return DirectoryInfo(my_documents);
#else
	return path("");
#endif // _MSC_VER

}

void DirectoryInfo::GetFiles(LocaleString path, std::vector<FileInfo>& result)
{
#ifdef _MSC_VER
	intptr_t hFile = 0;
	struct _finddata_t fileinfo;
	std::string p;
	if ((hFile = _findfirst((path + "\\\\*").ToChars(), &fileinfo)) != -1)
	{
		do
		{
			if ((fileinfo.attrib & _A_SUBDIR))
			{
				if (strcmp(fileinfo.name, ".") != 0 && strcmp(fileinfo.name, "..") != 0)
				{
					GetFiles(path + "\\\\" + fileinfo.name, result);
				}
			}
			else
			{
				result.push_back(path + "\\\\" + fileinfo.name);
			}
		} while (_findnext(hFile, &fileinfo) == 0);
		_findclose(hFile);
	}
	else
	{
		//error
	}
#endif // _MSC_VER
}
`;

        return [{
            FileName: `${namespace}_IO_DirectoryInfo.h`,
            Content: header
        }, {
            FileName: `${namespace}_IO_DirectoryInfo.cpp`,
            Content: source
        }];
    };

    let generatePathClass = (namespace: string, exportDefine: string) => {
        let header = `
#ifndef __${namespace.toUpperCase()}_IO_PATH_H__
#define __${namespace.toUpperCase()}_IO_PATH_H__
#include "${namespace}_Macro.h"
#include "${namespace}_String.h"
namespace ${namespace}
{
    namespace IO
    {
        class ${exportDefine} Path
        {
        public:
            static UTF8String GetDirectoryName(UTF8String value);
            
            static UTF8String GetFileName(UTF8String value);
            
            static UTF8String GetFileExtension(UTF8String value);
            
            static UTF8String GetFileNameWithoutExtension(UTF8String value);
            
            static UTF8String ReFileNameWithoutExtension(UTF8String value, UTF8String nameWithoutExtension);
            
            static UTF8String ReFileName(UTF8String value, UTF8String name);
            
            static UTF8String ReFileExtension(UTF8String value, UTF8String Extension);
            
            static UTF8String ReDirectoryName(UTF8String value, UTF8String directory);
            
            static UTF8String GetSplitChar(UTF8String value);
            
            static UTF8String GetSplitChar(std::vector<UTF8String> values);
            
            static LocaleString GenerateTemporaryPath();
            
            static LocaleString GenerateTemporaryDirectory();

#ifdef GetTempFileName
#undef GetTempFileName
#endif

            static LocaleString GetTempFileName();

#ifdef GetTempPath
#undef GetTempPath
#endif

            static LocaleString GetTempPath();
            
            static bool IsEqual(UTF8String first, UTF8String second);
            
            static LocaleString GetModulePath();
            
            static LocaleString GetModulePath(void *func);
#ifdef _MSC_VER
#if _MSC_VER <= 1800
            static LocaleString Combine(LocaleString directory, LocaleString subPath);

            static LocaleString Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2);

            static LocaleString Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2, LocaleString subPath3);

            static LocaleString Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2, LocaleString subPath3, LocaleString subPath4);
#else
            static LocaleString Combine(LocaleString arg)
            {
                return arg;
            }

            template <typename... Args>
            static LocaleString Combine(const LocaleString &arg, Args... args)
            {
                UTF8String splitChar = GetSplitChar(UTF8String::Vector(arg, args...));
                return arg.TrimEnd("\\\\/") + splitChar + Combine(args...);
            }
#endif
#else
            static LocaleString Combine(LocaleString arg)
            {
                return arg;
            }

            template <typename... Args>
            static LocaleString Combine(const LocaleString &arg, Args... args)
            {
                UTF8String splitChar = GetSplitChar(UTF8String::Vector(arg, args...));
                return arg.TrimEnd("\\\\/") + splitChar + Combine(args...);
            }
#endif
        };
    }
}
#endif`;
        let source = `
#include "${namespace}_IO_Path.h"
#include "${namespace}_ID.h"
#include "${namespace}_IO_Directory.h"
#ifdef _MSC_VER
#include "windows.h"
#include <shlobj.h>
#include <direct.h>
#include <io.h>
#endif

using namespace ${namespace};
using namespace IO;

UTF8String Path::GetDirectoryName(UTF8String value)
{
	std::vector<UTF8String> splits;
	splits.push_back("/");
	splits.push_back("\\\\");
	int Index = value.LastIndexOf(splits);
	if (Index == -1)return UTF8String("");
	else
	{
		return value.SubString(0, Index);
	}
}

UTF8String Path::GetFileName(UTF8String value)
{
	std::vector<UTF8String> splits;
	splits.push_back("/");
	splits.push_back("\\\\");
	int Index = value.LastIndexOf(splits);
	if (Index == -1)return value;
	else return value.SubString(Index + 1);
}

UTF8String Path::GetFileExtension(UTF8String value)
{
	UTF8String name = GetFileName(value);
	int Index = name.LastIndexOf(".");
	if (Index == -1)return "";
	else return name.SubString(Index);
}

UTF8String Path::GetFileNameWithoutExtension(UTF8String value)
{
	UTF8String name = GetFileName(value);
	int Index = name.LastIndexOf(".");
	if (Index == -1)return name;
	else return name.SubString(0, Index);
}

UTF8String Path::ReFileNameWithoutExtension(UTF8String value,UTF8String nameWithoutExtension)
{
	return GetDirectoryName(value) + GetSplitChar(value) + nameWithoutExtension + GetFileExtension(value);
}

UTF8String Path::ReFileName(UTF8String value,UTF8String name)
{
	return GetDirectoryName(value) + GetSplitChar(value) + name;
}

UTF8String Path::ReFileExtension(UTF8String value,UTF8String extension)
{
	if (!extension.StartsWith("."))
	{
		extension = "." + extension;
	}
	return GetDirectoryName(value) + GetSplitChar(value) + GetFileNameWithoutExtension(value) + extension;
}

UTF8String Path::ReDirectoryName(UTF8String value,UTF8String directory)
{
	return directory + GetSplitChar(value) + GetFileName(value);
}

UTF8String Path::GetSplitChar(UTF8String value)
{
	if (value.Contains("/"))return "/";
	else return "\\\\";
}

UTF8String IO::Path::GetSplitChar(std::vector<UTF8String> values)
{
    for(size_t i = 0; i < values.size(); i++)
    {
        if (values[i].Contains("/"))return "/";
        else if (values[i].Contains("\\\\"))return "\\\\";
    }
	return "\\\\";
}

LocaleString IO::Path::GenerateTemporaryPath()
{
#ifdef _MSC_VER
	char tempPath[MAX_PATH];
	DWORD result = GetTempPathA(MAX_PATH, tempPath);
	if (result > 0 && result < MAX_PATH) {
		char tempFileName[MAX_PATH];
		UINT uniqueNum = GetTempFileNameA(tempPath, "temp", 0, tempFileName);

		if (uniqueNum != 0) {
			return tempFileName;
		}
		else {
			return "";
		}
	}
	else {
		return "";
	}
#endif // _MSC_VER
	return "";
}

#ifdef GetTempPath
#undef GetTempPath
#endif

#ifdef CreateDirectory
#undef CreateDirectory
#endif

LocaleString IO::Path::GenerateTemporaryDirectory()
{
	LocaleString tempDirectory = Combine(GetTempPath(),ID::GenerateGUID());
	Directory::CreateDirectory(tempDirectory);
	return tempDirectory;
}


#ifdef GetTempFileName
#undef GetTempFileName
#endif
LocaleString IO::Path::GetTempFileName()
{
	return GenerateTemporaryPath();
}

LocaleString IO::Path::GetTempPath()
{
	#ifdef _MSC_VER
	char tempPath[MAX_PATH];
	DWORD result = GetTempPathA(MAX_PATH, tempPath);
	if (result > 0 && result < MAX_PATH) {
		return tempPath;
	}
	else {
		return "";
	}
	#else
	return "";
	#endif // _MSC_VER
	
}

bool IO::Path::IsEqual(UTF8String first, UTF8String second)
{
	UTF8String firstPath = "";
	for (int i = 0; i < first.Length(); i++)
	{
		if (first[i] == '\\\\')firstPath.Append("/");
		else firstPath.Append(first[i]);
	}
	firstPath = firstPath.Trim();
	UTF8String secondPath = "";
	for (int i = 0; i < second.Length(); i++)
	{
		if (second[i] == '\\\\')secondPath.Append("/");
		else secondPath.Append(second[i]);
	}
	secondPath = secondPath.Trim();
	return firstPath == secondPath;
}

HMODULE TidyIO_Path_GetModuleHandleByFunction(void* func) {
	HMODULE hModule = NULL;
	GetModuleHandleExW(
		GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS,
		(LPCWSTR)func,
		&hModule
	);
	return hModule;
}

LocaleString IO::Path::GetModulePath()
{
	return GetModulePath(TidyIO_Path_GetModuleHandleByFunction);
}

LocaleString IO::Path::GetModulePath(void* func)
{
	HMODULE hModule = TidyIO_Path_GetModuleHandleByFunction(func);
	if (hModule != SUPPORT_NULLPTR) {
		char modulePath[MAX_PATH];
		DWORD result = GetModuleFileNameA(hModule, modulePath, MAX_PATH);
		if (result > 0 && result < MAX_PATH) {
			return modulePath;
		}
		else {
			return "";
		}
	}
	else {
		return "";
	}
}

#ifdef _MSC_VER
#if _MSC_VER <= 1800
LocaleString IO::Path::Combine(LocaleString directory, LocaleString subPath)
{
	UTF8String splitChar = GetSplitChar(UTF8String::Vector(directory, subPath));
	return directory.TrimEnd("\\\\/") + splitChar + subPath.TrimStart("\\\\/");
}

LocaleString IO::Path::Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2)
{
	UTF8String splitChar = GetSplitChar(UTF8String::Vector(directory, subPath1, subPath2));
	return directory.TrimEnd("\\\\/") + splitChar + subPath1.Trim("\\\\/") + splitChar + subPath2.TrimStart("\\\\/");
}

LocaleString IO::Path::Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2, LocaleString subPath3)
{
	UTF8String splitChar = GetSplitChar(UTF8String::Vector(directory, subPath1, subPath2, subPath3));
	return directory.TrimEnd("\\\\/") + splitChar + subPath1.Trim("\\\\/") + splitChar + subPath2.Trim("\\\\/") + splitChar + subPath3.TrimStart("\\\\/");
}

LocaleString IO::Path::Combine(LocaleString directory, LocaleString subPath1, LocaleString subPath2, LocaleString subPath3, LocaleString subPath4)
{
	UTF8String splitChar = GetSplitChar(UTF8String::Vector(directory, subPath1, subPath2, subPath3, subPath4));
	return directory.TrimEnd("\\\\/") + splitChar + subPath1.Trim("\\\\/") + splitChar + subPath2.Trim("\\\\/") + splitChar + subPath3.Trim("\\\\/") + splitChar + subPath4.TrimStart("\\\\/");
}
#endif
#endif`;
        return [{
            FileName: `${namespace}_IO_Path.h`,
            Content: header
        }, {
            FileName: `${namespace}_IO_Path.cpp`,
            Content: source
        }];
    };

    let generate = () => {
        let classes = [] as {
            FileName: string,
            Content: string
        }[];
        generateMacro().forEach((item) => {
            classes.push(item);
        });
        generateEncodingClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
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
        generateBytesClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateFileInfoClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateFileClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateDirectoryClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generateDirectoryInfoClass(config.namespace, config.exportDefine).forEach((item) => {
            classes.push(item);
        });
        generatePathClass(config.namespace, config.exportDefine).forEach((item) => {
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


let main = async () => {
    console.log("Please input header file path:");
    var headerPath = Console.ReadLine();
    if (Directory.Exists(headerPath) == false) {
        console.log("The header file path is not exist.");
        return;
    }
    console.log("Please input source file path:");
    var sourcePath = Console.ReadLine();
    if (Directory.Exists(sourcePath) == false) {
        console.log("The source file path is not exist.");
        return;
    }

    let classes = generator.generate();
    for (let classFile of classes) {
        if (classFile.FileName.endsWith(".h")) {
            let headerFile = Path.Combine(headerPath, classFile.FileName);
            File.WriteAllText(headerFile, classFile.Content);
        }
        else {
            let sourceFile = Path.Combine(sourcePath, classFile.FileName);
            File.WriteAllText(sourceFile, classFile.Content);
        }
    }
};

await main();