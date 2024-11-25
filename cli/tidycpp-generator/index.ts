import { File } from "../.tsc/System/IO/File";
let TidyCppGenerator = (config: {
    namespace: string,
    exportDefine: string,
}) => {
    let generate_SUPPORT_NULLPTR = () => {
        let lines = [] as string[];
        lines.push(`#ifndef SUPPORT_NULLPTR`);
        lines.push(`#if defined(_MSC_VER) && _MSC_VER >= 1600`);
        lines.push(`#define SUPPORT_NULLPTR nullptr`);
        lines.push(`#else`);
        lines.push(`#define SUPPORT_NULLPTR NULL`);
        lines.push(`#endif`);
        lines.push(`#endif`);
        return lines.join('\r\n');
    };
    let generate_SUPPORT_STD_STRINGSTREAM = () => {
        return `#ifndef SUPPORT_STD_STRINGSTREAM
#if _MSC_VER >= 1400
#define SUPPORT_STD_STRINGSTREAM 1
#else
#define SUPPORT_STD_STRINGSTREAM 0
#endif
#endif`;
    };
    let generate_SUPPORT_STD_WSTRING = () => {
        return `#ifndef SUPPORT_STD_WSTRING
#if __cplusplus >= 201103L
#define SUPPORT_STD_WSTRING 1
#else
#define SUPPORT_STD_WSTRING 0
#endif
#endif`;
    };
    let generate_SUPPORT_EXPLICIT = () => {
        return `#ifndef SUPPORT_EXPLICIT
#if __cplusplus >= 201103L
#define SUPPORT_EXPLICIT explicit
#else
#define SUPPORT_EXPLICIT
#endif
#endif`;
    };
    let generate_SUPPORT_INT64 = () => {
        return `#ifndef SUPPORT_INT64
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
        return `#ifndef SUPPORT_STD_OSTRINGSTREAM
#if _MSC_VER >= 1400
#define SUPPORT_STD_OSTRINGSTREAM 1
#else
#define SUPPORT_STD_OSTRINGSTREAM 0
#endif
#endif`;
    };
    let generate_SUPPORT_RVALUE_REFERENCES = () => {
        return `#ifndef SUPPORT_RVALUE_REFERENCES
#if __cplusplus >= 201103L
#define SUPPORT_RVALUE_REFERENCES 1
#else
#define SUPPORT_RVALUE_REFERENCES 0
#endif
#endif`;
    };
    let generateStringClass = (namespace: string, className: string, targetEncoding: number, exportDefine: string, allStringClassNames: string[]) => {
        let lines = [] as string[];
        lines.push(`#ifndef __${namespace.toUpperCase()}_${className.toUpperCase()}_H__`);
        lines.push(`#define __${namespace.toUpperCase()}_${className.toUpperCase()}_H__`);
        lines.push(`#include <string>`);
        lines.push(`#include <vector>`);
        lines.push(`#if SUPPORT_STD_WSTRING
#include <wstring>
#endif`);
        lines.push(`#include "${namespace}_StringUtil.h"`);
        lines.push(generate_SUPPORT_NULLPTR());
        // SUPPORT_STD_STRINGSTREAM宏定义
        lines.push(generate_SUPPORT_STD_STRINGSTREAM());
        // SUPPORT_EXPLICIT宏定义
        lines.push(generate_SUPPORT_EXPLICIT());
        // SUPPORT_INT64宏定义，64位
        lines.push(generate_SUPPORT_INT64());
        // SUPPORT_STD_OSTRINGSTREAM宏定义
        lines.push(generate_SUPPORT_STD_OSTRINGSTREAM());
        // SUPPORT_STD_WSTRING宏定义
        lines.push(generate_SUPPORT_STD_WSTRING());
        // SUPPORT_RVALUE_REFERENCES宏定义
        lines.push(generate_SUPPORT_RVALUE_REFERENCES());
        lines.push(`namespace ${namespace} {`);
        for (let i = 0; i < allStringClassNames.length; i++) {
            if (allStringClassNames[i] == className) {
                continue;
            }
            lines.push(`class ${allStringClassNames[i]};`);
        }
        lines.push(`class ${exportDefine} ${className} {`);
        lines.push(`public:`);
        lines.push(`    std::string Target;
    int TargetEncoding;
    ${className}() {
        this->Target = "";
        this->TargetEncoding = ${targetEncoding};
    }`);

        // 从wchar_t*转换的构造函数
        lines.push(`    ${className}(const wchar_t* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = StringUtil::To(target, TargetEncoding);
        }
    }`);

        // 从std::wstring转换的构造函数
        lines.push(`#if SUPPORT_STD_WSTRING
        ${className}(const std::wstring& target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = StringUtil::To(target.c_str(), TargetEncoding);
    }
#endif`);

        // 从std::string转换的构造函数
        lines.push(`    ${className}(const std::string& target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = target;
    }`);

        // 从const char*转换的构造函数
        lines.push(`    ${className}(const char* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = target;
        }
    }`);

        // 从char*转换的构造函数
        lines.push(`    ${className}(char* target) {
        this->TargetEncoding = ${targetEncoding};
        if (target == SUPPORT_NULLPTR) {
            this->Target = "";
        } else {
            this->Target = target;
        }
    }`);

        // 从std::stringstream转换的构造函数
        lines.push(`#if SUPPORT_STD_STRINGSTREAM
    ${className}(const std::stringstream& target) {
        this->TargetEncoding = ${targetEncoding};
        std::ostringstream ss;
        ss << target.rdbuf();
        this->Target = ss.str();
    }
#endif`);

        // 从int转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(int target) {
        this->TargetEncoding = ${targetEncoding};
        this->Target = std::to_string(target);
    }`);

        // 从long转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(long target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从SUPPORT_INT64转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(SUPPORT_INT64 target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从SUPPORT_INT64转换的构造函数，使用指定进制
        lines.push(`    SUPPORT_EXPLICIT ${className}(SUPPORT_INT64 value, const ${className}& base) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::string();`);
        lines.push(`        int baseLength = base.Length();`);
        lines.push(`        while (true) {`);
        lines.push(`            SUPPORT_INT64 next = value / baseLength;`);
        lines.push(`            SUPPORT_INT64 mod = value % baseLength;`);
        lines.push(`            Insert(0, base[(int)mod]);`);
        lines.push(`            if (next == 0) {`);
        lines.push(`                break;`);
        lines.push(`            }`);
        lines.push(`            value = next;`);
        lines.push(`        }`);
        lines.push(`    }`);

        // 从unsigned short转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(unsigned short target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从unsigned int转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(unsigned int target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从unsigned long long转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(unsigned long long target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从double转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(double target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`#if SUPPORT_STD_OSTRINGSTREAM`);
        lines.push(`        std::ostringstream out;`);
        lines.push(`        out.precision(14);`);
        lines.push(`        out << std::fixed << target;`);
        lines.push(`        this->Target = out.str();`);
        lines.push(`#else`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`#endif`);
        lines.push(`    }`);

        // 从char转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(char target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::string();`);
        lines.push(`        this->Target.append(1, target);`);
        lines.push(`    }`);

        // 从float转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(float target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = std::to_string(target);`);
        lines.push(`    }`);

        // 从bool转换的构造函数
        lines.push(`    SUPPORT_EXPLICIT ${className}(bool target) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        this->Target = target ? "true" : "false";`);
        lines.push(`    }`);

        // 从另一个String类转换的构造函数
        for (let stringClassName of allStringClassNames) {
            if (stringClassName == className) {
                continue;
            }
            lines.push(`    ${className}(const ${stringClassName}& target) {`);
            lines.push(`        this->TargetEncoding = ${targetEncoding};`);
            lines.push(`        if (target.TargetEncoding == this->TargetEncoding) {`);
            lines.push(`            this->Target = target.Target;`);
            lines.push(`        } else {`);
            lines.push(`            this->Target = StringUtil::To(target.Target, target.TargetEncoding, this->TargetEncoding);`);
            lines.push(`        }`);
            lines.push(`    }`);

            lines.push(`#if SUPPORT_RVALUE_REFERENCES`);
            lines.push(`    ${className}(const ${stringClassName}&& target) {`);
            lines.push(`        this->TargetEncoding = ${targetEncoding};`);
            lines.push(`        if (target.TargetEncoding == this->TargetEncoding) {`);
            lines.push(`            this->Target = target.Target;`);
            lines.push(`        } else {`);
            lines.push(`            this->Target = StringUtil::To(target.Target, target.TargetEncoding, this->TargetEncoding);`);
            lines.push(`        }`);
            lines.push(`    }`);
            lines.push(`#endif`);
        }

        // hexbase
        lines.push(`    static ${className} HexBase() {`);
        lines.push(`        return "0123456789ABCDEF";`);
        lines.push(`    }`);

        // Hex
        lines.push(`    static ${className} Hex(SUPPORT_INT64 value) {`);
        lines.push(`        return ${className}(value, HexBase());`);
        lines.push(`    }`);

        // FromPointer
        lines.push(`    static ${className} FromPointer(void* value) {`);
        lines.push(`#if SUPPORT_STD_STRINGSTREAM`);
        lines.push(`        std::stringstream ss;`);
        lines.push(`        ss << std::setfill('0') << std::setw(sizeof(void*) * 2) << std::hex << reinterpret_cast<uintptr_t>(target);`);
        lines.push(`        return ss.str();`);
        lines.push(`#else`);
        lines.push(`        return Hex(reinterpret_cast<SUPPORT_INT64>(value));`);
        lines.push(`#endif`);
        lines.push(`    }`);

        // ToChars
        lines.push(`    const char* ToChars() const {`);
        lines.push(`        return this->Target.c_str();`);
        lines.push(`    }`);

        // Clone
        lines.push(`    char* Clone() const {`);
        lines.push(`        char* result = new char[this->Target.size() + 1];`);
        lines.push(`        memset(result, 0, this->Target.size() + 1);`);
        lines.push(`        strcpy(result, this->Target.c_str());`);
        lines.push(`        return result;`);
        lines.push(`    }`);

        // ToWString
        lines.push(`#if SUPPORT_STD_WSTRING
    std::wstring ToWString() const {
    return StringUtil::To(Target, TargetEncoding);
    }
#endif`);

        // Length
        lines.push(`    int Length() const {`);
        lines.push(`        return (int)this->Target.length();`);
        lines.push(`    }`);

        // SubString
        lines.push(`    ${className} SubString(int start, int length = -1) const {`);
        lines.push(`    if (length == -1)
        return Target.substr(offset);
    else
        return Target.substr(offset, length);`);
        lines.push(`    }`);

        // Insert
        lines.push(`     ${className}& Insert(int index, const ${className}& value) {`);
        lines.push(`        this->Target.insert(index, value.Target);`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // IndexOf
        lines.push(`    int IndexOf(const ${className}& value, int start = 0) const {`);
        lines.push(`        size_t result = this->Target.find(value.Target, start);`);
        lines.push(`        if (result == std::string::npos) {`);
        lines.push(`            return -1;`);
        lines.push(`        }`);
        lines.push(`        return (int)result;`);
        lines.push(`    }`);

        // LastIndexOf
        lines.push(`    int LastIndexOf(const ${className}& value, int start = -1) const {`);
        lines.push(`        start = start == -1 ? std::string::npos : start;`);
        lines.push(`        size_t result = this->Target.rfind(value.Target, start);`);
        lines.push(`        if (result == std::string::npos) {`);
        lines.push(`            return -1;`);
        lines.push(`        }`);
        lines.push(`        return (int)result;`);
        lines.push(`    }`);

        // LastIndexOf
        lines.push(`    int LastIndexOf(const std::vector<${className}>& values, int start = -1) const {`);
        lines.push(`        start = start == -1 ? std::string::npos : start;`);
        lines.push(`        int result = -1;`);
        lines.push(`        for (const ${className}& value : values) {`);
        lines.push(`            int index = LastIndexOf(value, start);`);
        lines.push(`            if (index != -1) {`);
        lines.push(`                if (index > result) {`);
        lines.push(`                    result = index;`);
        lines.push(`                }`);
        lines.push(`            }`);
        lines.push(`        }`);
        lines.push(`        return result;`);
        lines.push(`    }`);

        // Replace
        lines.push(`    ${className} Replace(const ${className}& oldValue, const ${className}& newValue) const {`);
        lines.push(`        std::string temp = Target;
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
        lines.push(`    }`);

        // Replace values
        lines.push(`    ${className} Replace(const std::vector<${className}>& oldValues, const std::vector<${className}>& newValues) const {`);
        lines.push(`        ${className} result = Target;`);
        lines.push(`        for (size_t i = 0; i < oldValues.size(); i++) {`);
        lines.push(`            result = result.Replace(oldValues[i], newValues[i]);`);
        lines.push(`        }`);
        lines.push(`        return result;`);
        lines.push(`    }`);

        // Append
        lines.push(`    ${className}& Append(const ${className}& value) {`);
        lines.push(`        this->Target.append(value.Target);`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // Append values
        lines.push(`    ${className}& Append(const std::vector<${className}>& values) {`);
        lines.push(`        for (const ${className}& value : values) {`);
        lines.push(`            this->Target.append(value.Target);`);
        lines.push(`        }`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // AppendLine
        lines.push(`    ${className}& AppendLine(const ${className}& value) {`);
        lines.push(`        this->Target.append(value.Target);`);
        lines.push(`        this->Target.append("\\r\\n");`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // AppendLine just line
        lines.push(`    ${className}& AppendLine() {`);
        lines.push(`        this->Target.append("\\r\\n");`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // MiddleValue
        lines.push(`    ${className} MiddleValue(const ${className}& startValue, const ${className}& endValue, int index = 0) const {`);
        lines.push(`        size_t offset = 0;
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
        lines.push(`    }`);

        // MiddleCount
        lines.push(`    int MiddleCount(const ${className}& startValue, const ${className}& endValue) const {`);
        lines.push(`        size_t offset = 0;
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
        lines.push(`    }`);

        // Repeat
        lines.push(`    static ${className} Repeat(const ${className} value, int count) {`);
        lines.push(`        ${className} result;`);
        lines.push(`        for (int i = 0; i < count; i++) {`);
        lines.push(`            result.Append(value);`);
        lines.push(`        }`);
        lines.push(`        return result;`);
        lines.push(`    }`);

        // Repeat
        lines.push(`    ${className} Repeat(int count) const {`);
        lines.push(`        ${className} result;`);
        lines.push(`        for (int i = 0; i < count; i++) {`);
        lines.push(`            result.Append(*this);`);
        lines.push(`        }`);
        lines.push(`        return result;`);
        lines.push(`    }`);

        // Trim
        lines.push(`    ${className} Trim(const ${className}& chars = " ") const {`);
        lines.push(`        std::string result = Target;
        std::string trimChars = chars.Target;
        // Trim from the beginning  
        auto it = result.begin();
        while (it != result.end() && trimChars.find(*it) != std::string::npos) {
            ++it;
        }
        result.erase(result.begin(), it);

        // Trim from the end  
        auto rit = result.rbegin();
        while (rit != result.rend() && trimChars.find(*rit) != std::string::npos) {
            ++rit;
        }
        result.erase(rit.base(), result.end());

        return result;`);
        lines.push(`    }`);

        // TrimStart
        lines.push(`    ${className} TrimStart(const ${className}& chars = " ") const {`);
        lines.push(`        std::string result = Target;
        std::string trimChars = chars.Target;
        size_t pos = result.find_first_not_of(trimChars);
        if (pos != std::string::npos) {
            return result.substr(pos);
        }
        else {
            return ""; // 如果整个字符串都是由要删除的字符组成，则返回空字符串  
        }`);
        lines.push(`    }`);

        // TrimEnd
        lines.push(`    ${className} TrimEnd(const ${className}& chars = " ") const {`);
        lines.push(`        std::string result = Target;
        std::string trimChars = items.Target;

        auto rit = result.rbegin();
        while (rit != result.rend() && trimChars.find(*rit) != std::string::npos) {
            ++rit;
        }
        result.erase(rit.base(), result.end());

        return result;`);
        lines.push(`    }`);

        // OnlyNumber
        lines.push(`    ${className} OnlyNumber() const {`);
        lines.push(`        ${className} result;
        for (char item : Target)
        {
            if (item >= '0' && item <= '9')
            {
                result.Append(item);
            }
        }
        return result;`);
        lines.push(`    }`);

        // RemoveChars
        lines.push(`    ${className} RemoveChars(const ${className}& chars) const {`);
        lines.push(`        ${className} result;
        for (char item : Target)
        {
            if (!items.Contains(item))
            {
                result.Append(item);
            }
        }
        return result;`);
        lines.push(`    }`);

        // IsEmpty
        lines.push(`    bool IsEmpty() const {`);
        lines.push(`        return Target.empty();`);
        lines.push(`    }`);

        // Remove
        lines.push(`    ${className} Remove(int start, int length = -1) const {`);
        lines.push(`        std::string result = Target;
			if (length == -1)
			{
				result.erase(start);
			}
			else
			{
				result.erase(start, length);
			}
			return result;`);
        lines.push(`    }`);

        // StartsWith
        lines.push(`    bool StartsWith(const ${className}& value) const {`);
        lines.push(`        return Target.find(value.Target) == 0;`);
        lines.push(`    }`);

        // EndsWith
        lines.push(`    bool EndsWith(const ${className}& value) const {`);
        lines.push(`        return Target.rfind(value.Target) == (Target.size() - value.Length());`);
        lines.push(`    }`);

        // Contains
        lines.push(`    bool Contains(const ${className}& value) const {`);
        lines.push(`        return Target.find(value.Target) != std::string::npos;`);
        lines.push(`    }`);

        // FillEnd
        lines.push(`    ${className} FillEnd(int length, const ${className}& value) const {`);
        lines.push(`        ${className} result = Target;
        while (result.Length() < length)
        {
            result.Append(value);
        }
        return result;`);
        lines.push(`    }`);

        // FillStart
        lines.push(`    ${className} FillStart(int length, const ${className}& value) const {`);
        lines.push(`        ${className} result = Target;
        while (result.Length() < length)
        {
            result.Insert(0, value);
        }
        return result;`);
        lines.push(`    }`);

        // Format {0}
        lines.push(`    ${className} Format(const ${className}& value0) const {`);
        lines.push(`        return Replace("{0}", value0);`);
        lines.push(`    }`);

        // Format {0} {1}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1);`);
        lines.push(`    }`);

        // Format {0} {1} {2}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3} {4}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6} {7}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6, const ${className}& value7) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6).Replace("{7}", value7);`);
        lines.push(`    }`);

        // Format {0} {1} {2} {3} {4} {5} {6} {7} {8}
        lines.push(`    ${className} Format(const ${className}& value0, const ${className}& value1, const ${className}& value2, const ${className}& value3, const ${className}& value4, const ${className}& value5, const ${className}& value6, const ${className}& value7, const ${className}& value8) const {`);
        lines.push(`        return Replace("{0}", value0).Replace("{1}", value1).Replace("{2}", value2).Replace("{3}", value3).Replace("{4}", value4).Replace("{5}", value5).Replace("{6}", value6).Replace("{7}", value7).Replace("{8}", value8);`);
        lines.push(`    }`);

        // Clear
        lines.push(`    ${className}& Clear() {`);
        lines.push(`        this->Target.clear();`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // IsNumber
        lines.push(`    bool IsNumber() const {`);
        lines.push(`        if (Target.empty()) {
            return false;
        }
        for (char item : Target) {
            if (item < '0' || item > '9') {
                return false;
            }
        }
        return true;`);
        lines.push(`    }`);

        // ToInt
        lines.push(`    int ToInt() const {`);
        lines.push(`        try {`);
        lines.push(`            return std::stoi(Target);`);
        lines.push(`        } catch (...) {`);
        lines.push(`            throw new std::exception("String is not a number.");`);
        lines.push(`        }`);
        lines.push(`    }`);

        // ToFloat
        lines.push(`    float ToFloat() const {`);
        lines.push(`        try {`);
        lines.push(`            return std::stof(Target);`);
        lines.push(`        } catch (...) {`);
        lines.push(`            throw new std::exception("String is not a number.");`);
        lines.push(`        }`);
        lines.push(`    }`);

        // ToDouble
        lines.push(`    double ToDouble() const {`);
        lines.push(`        try {`);
        lines.push(`            return std::stod(Target);`);
        lines.push(`        } catch (...) {`);
        lines.push(`            throw new std::exception("String is not a number.");`);
        lines.push(`        }`);
        lines.push(`    }`);

        // ToInt64
        lines.push(`    SUPPORT_INT64 ToInt64() const {`);
        lines.push(`        try {`);
        lines.push(`            return std::stoll(Target);`);
        lines.push(`        } catch (...) {`);
        lines.push(`            throw new std::exception("String is not a number.");`);
        lines.push(`        }`);
        lines.push(`    }`);

        // IsTrue
        lines.push(`    bool IsTrue() const {`);
        lines.push(`        return ToLower() == "true";`);
        lines.push(`    }`);

        // IsFalse
        lines.push(`    bool IsFalse() const {`);
        lines.push(`        return ToLower() == "false";`);
        lines.push(`    }`);

        // ToBool
        lines.push(`    bool ToBool() const {`);
        lines.push(`        if (ToLower() == "true") {`);
        lines.push(`            return true;`);
        lines.push(`        } else if (ToLower() == "false") {`);
        lines.push(`            return false;`);
        lines.push(`        } else {`);
        lines.push(`            throw new std::exception("String is not a boolean.");`);
        lines.push(`        }`);
        lines.push(`    }`);

        // To StdString
        lines.push(`    std::string ToStdString(unsigned int encodingPage) const {`);
        lines.push(`        return StringUtil::To(Target, TargetEncoding, encodingPage);`);
        lines.push(`    }`);

        // ToLower
        lines.push(`    ${className} ToLower() const {`);
        lines.push(`        std::string result = Target;
        std::transform(result.begin(), result.end(), result.begin(), ::tolower);
        return result;`);
        lines.push(`    }`);

        // ToUpper
        lines.push(`    ${className} ToUpper() const {`);
        lines.push(`        std::string result = Target;
        std::transform(result.begin(), result.end(), result.begin(), ::toupper);
        return result;`);
        lines.push(`    }`);

        // Split by chars
        lines.push(`    std::vector<${className}> Split(const ${className}& chars) const {`);
        lines.push(`        std::vector<${className}> result;
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
        lines.push(`    }`);

        // Intersect
        lines.push(`    ${className} Intersect(const ${className}& value) const {`);
        lines.push(`        std::string result;
        for (char item : Target)
        {
            if (value.Contains(item))
            {
                result.append(1, item);
            }
        }
        return result;`);
        lines.push(`    }`);

        // Map
        lines.push(`    ${className} Map(std::function<${className}(${className})> func) const {`);
        lines.push(`        ${className} result;
        for (char item : Target)
        {
            result.Append(func(item));
        }
        return result;`);
        lines.push(`    }`);

        // Index
        lines.push(`    ${className} operator[](int index) const {`);
        lines.push(`        return Target[index];`);
        lines.push(`    }`);

        // =
        lines.push(`    ${className}& operator=(const ${className}& value) {`);
        lines.push(`        this->TargetEncoding = ${targetEncoding};`);
        lines.push(`        if(this != &value) {`);
        lines.push(`            this->Target = value.Target;`);
        lines.push(`        }`);
        lines.push(`        return *this;`);
        lines.push(`    }`);

        // + const char*
        lines.push(`    ${className} operator+(const char* value) const {`);
        lines.push(`        return Target + value;`);
        lines.push(`    }`);

        // + std::string
        lines.push(`    ${className} operator+(const std::string& value) const {`);
        lines.push(`        return Target + value;`);
        lines.push(`    }`);

        // +
        lines.push(`    ${className} operator+(const ${className}& value) const {`);
        lines.push(`        return Target + value.Target;`);
        lines.push(`    }`);

        // + &&
        lines.push(`#if SUPPORT_RVALUE_REFERENCES`);
        lines.push(`    ${className} operator+(const ${className}&& value) const {`);
        lines.push(`        return Target + value.Target;`);
        lines.push(`    }`);
        lines.push(`#endif`);

        // + int
        lines.push(`    ${className} operator+(int value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + long
        lines.push(`    ${className} operator+(long value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + SUPPORT_INT64
        lines.push(`    ${className} operator+(SUPPORT_INT64 value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + unsigned int
        lines.push(`    ${className} operator+(unsigned int value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + float
        lines.push(`    ${className} operator+(float value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + double
        lines.push(`    ${className} operator+(double value) const {`);
        lines.push(`        return Target + std::to_string(value);`);
        lines.push(`    }`);

        // + bool
        lines.push(`    ${className} operator+(bool value) const {`);
        lines.push(`        return Target + (value ? "true" : "false");`);
        lines.push(`    }`);

        // + char
        lines.push(`    ${className} operator+(char value) const {`);
        lines.push(`        std::string result = Target;
        result.append(1, value);
        return result;`);
        lines.push(`    }`);

        //friend + const char *
        lines.push(`    friend ${className} operator+(const char* left, const ${className}& right) {`);
        lines.push(`        return left + right.Target;`);
        lines.push(`    }`);

        //friend + std::string
        lines.push(`    friend ${className} operator+(const std::string& left, const ${className}& right) {`);
        lines.push(`        return left + right.Target;`);
        lines.push(`    }`);

        // ==
        lines.push(`    bool operator==(const ${className}& value) const {`);
        lines.push(`        return Target == value.Target;`);
        lines.push(`    }`);

        // == const char *
        lines.push(`    bool operator==(const char* value) const {`);
        lines.push(`        return Target == value;`);
        lines.push(`    }`);

        // == std::string
        lines.push(`    bool operator==(const std::string& value) const {`);
        lines.push(`        return Target == value;`);
        lines.push(`    }`);

        // friend ==
        lines.push(`    friend bool operator==(const char* left, const ${className}& right) {`);
        lines.push(`        return left == right.Target;`);
        lines.push(`    }`);

        // friend ==
        lines.push(`    friend bool operator==(const std::string& left, const ${className}& right) {`);
        lines.push(`        return left == right.Target;`);
        lines.push(`    }`);

        // !=
        lines.push(`    bool operator!=(const ${className}& value) const {`);
        lines.push(`        return Target != value.Target;`);
        lines.push(`    }`);

        // !=
        lines.push(`    bool operator!=(const char* value) const {`);
        lines.push(`        return Target != value;`);
        lines.push(`    }`);

        // !=
        lines.push(`    bool operator!=(const std::string& value) const {`);
        lines.push(`        return Target != value;`);
        lines.push(`    }`);

        // friend !=
        lines.push(`    friend bool operator!=(const char* left, const ${className}& right) {`);
        lines.push(`        return left != right.Target;`);
        lines.push(`    }`);

        // friend !=
        lines.push(`    friend bool operator!=(const std::string& left, const ${className}& right) {`);
        lines.push(`        return left != right.Target;`);
        lines.push(`    }`);

        // <
        lines.push(`    bool operator<(const ${className}& value) const {`);
        lines.push(`        return Target < value.Target;`);
        lines.push(`    }`);

        // >
        lines.push(`    bool operator>(const ${className}& value) const {`);
        lines.push(`        return Target > value.Target;`);
        lines.push(`    }`);

        // std::ostream <<
        lines.push(`    friend std::ostream& operator<<(std::ostream& out, const ${className}& value) {`);
        lines.push(`        out << value.Target;`);
        lines.push(`        return out;`);
        lines.push(`    }`);

        // Join
        lines.push(`    static ${className} Join(const std::vector<${className}>& values, const ${className}& separator) {`);
        lines.push(`        ${className} result;
        for (size_t i = 0; i < values.size(); i++) {
            if (i != 0) {
                result.Append(separator);
            }
            result.Append(values[i]);
        }
        return result;`);
        lines.push(`    }`);

        for (let i = 0; i < 10; i++) {
            let parameters = [] as string[];
            for (let j = 0; j <= i; j++) {
                parameters.push(`const ${className}& value${j}`);
            }
            let parametersString = parameters.join(', ');
            lines.push(`    static std::vector<${className}> Vector(${parametersString}) {`);
            lines.push(`        std::vector<${className}> result;`);
            for (let j = 0; j <= i; j++) {
                lines.push(`        result.push_back(value${j});`);
            }
            lines.push(`        return result;`);
            lines.push(`    }`);
        }

        lines.push(`};`);
        lines.push(`};`);

        lines.push(`#endif`);

        return [{
            FileName: `${namespace}_${className}.h`,
            Content: lines.join('\r\n')
        }];
    };

    let generateStringUtilClass = (namespace: string, exportDefine: string) => {
        let lines = [] as string[];
        lines.push(`#ifndef __${namespace.toUpperCase()}_STRING_UTIL_H__`);
        lines.push(`#define __${namespace.toUpperCase()}_STRING_UTIL_H__`);
        // SUPPORT_NULLPTR
        lines.push(generate_SUPPORT_NULLPTR());
        // 
        lines.push(`#include <string>`);
        lines.push(`#include <vector>`);
        lines.push(`namespace ${namespace} {`);
        lines.push(`class ${exportDefine} StringUtil {`);
        lines.push(`public:`);
        lines.push(`    static unsigned int GetLocale();`);
        lines.push(`    static std::string To(const std::string &value, unsigned int fromCodePage, unsigned int toCodePage);`);
        lines.push(`    static std::string To(const wchar_t *value, unsigned int toCodePage);
#if SUPPORT_STD_WSTRING
    static std::wstring To(const std::string &value, unsigned int fromCodePage);
#endif`);
        lines.push(`};`);
        lines.push(`};`);
        lines.push(`#endif`);
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

    return {
        generateStringClasses
    };
};

let generator = TidyCppGenerator({
    namespace: "Tidy",
    exportDefine: ""
});
let classes = generator.generateStringClasses();
for (let classFile of classes) {
    File.WriteAllText(classFile.FileName, classFile.Content);
}