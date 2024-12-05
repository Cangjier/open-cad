export interface ICATNls {
    MacDeclareHeader: string,
    CommandHeader: string,
    Property: string,
    Value: string
}

export type Languages = "Simplified_Chinese" | "English";

export interface IPrereqComponent {
    Framework: string,
    Visiblity: Visiblity,
}

export type Visiblity = 'Public' | 'Private';

export interface IDictionary {
    AddinName: string,
    WorkshopName: string,
    ModuleName: string
}

export interface IClassInfomation {
    frameworkName: string;
    moduleName: string;
    className: string;
    includeFileName: string;
    filePath: string;
}
