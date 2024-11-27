import { XmlNode } from "../../System/Xml/XmlNode";
import { XmlDocument } from "../../System/Xml/XmlDocument";
import { XmlElement } from "../../System/Xml/XmlElement";
import { XmlAttribute } from "../../System/Xml/XmlAttribute";
import { XmlText } from "../../System/Xml/XmlText";
import { XmlCDataSection } from "../../System/Xml/XmlCDataSection";
import { XmlEntityReference } from "../../System/Xml/XmlEntityReference";
import { XmlEntity } from "../../System/Xml/XmlEntity";
import { XmlProcessingInstruction } from "../../System/Xml/XmlProcessingInstruction";
import { XmlComment } from "../../System/Xml/XmlComment";
import { XmlDocumentType } from "../../System/Xml/XmlDocumentType";
import { XmlDocumentFragment } from "../../System/Xml/XmlDocumentFragment";
import { XmlNotation } from "../../System/Xml/XmlNotation";
import { XmlDeclaration } from "../../System/Xml/XmlDeclaration";
import { XmlWhitespace } from "../../System/Xml/XmlWhitespace";
import { XmlSignificantWhitespace } from "../../System/Xml/XmlSignificantWhitespace";
import { Type } from "../../System/Type";
export class Xml {
    public IsElementPredicate(onPredicate?: ((arg0?:Xml)=>boolean)): boolean {
        return {} as any;
    }
    public ContainsAttribute(name?: string): boolean {
        return {} as any;
    }
    public SetAttribute(name?: string, value?: string): void {
        return {} as any;
    }
    public AddAttribute(name?: string, value?: string): void {
        return {} as any;
    }
    public GetAttribute(name?: string, defaultValue?: string): string {
        return {} as any;
    }
    public GetOrCreateAttribute(name?: string, defaultValue?: string): string {
        return {} as any;
    }
    public FirstElement(predicate?: ((arg0?:Xml)=>boolean)): Xml {
        return {} as any;
    }
    public GetElementByName(name?: string): Xml {
        return {} as any;
    }
    public FirstElementByName(name?: string): Xml {
        return {} as any;
    }
    public GetOrCreateElementByName(name?: string): Xml {
        return {} as any;
    }
    public ContainsElementByName(name?: string): boolean {
        return {} as any;
    }
    public GetElementByNameAndAttribute(name?: string, attributeName?: string, attributeValue?: string): boolean {
        return {} as any;
    }
    public GetOrCreateElementByNameAndAttribute(name?: string, attributeName?: string, attributeValue?: string): Xml {
        return {} as any;
    }
    public AddElement(name?: string): Xml {
        return {} as any;
    }
    public Clear(): void {
        return {} as any;
    }
    public Save(path?: string): void {
        return {} as any;
    }
    public GetOrCreateRoot(name?: string): Xml {
        return {} as any;
    }
    public ToString(): string {
        return {} as any;
    }
    public Equals(obj?: any): boolean {
        return {} as any;
    }
    public GetHashCode(): number {
        return {} as any;
    }
    public GetType(): Type {
        return {} as any;
    }
    public constructor(node?: XmlNode) {
    }
    public static Load(path?: string): Xml {
        return {} as any;
    }
    public static TryLoad(path?: string, onDefaultValue?: (()=>Xml)): Xml {
        return {} as any;
    }
    public static Parse(xml?: string): Xml {
        return {} as any;
    }
    public static TryParse(xml?: string, onDefaultValue?: (()=>Xml)): Xml {
        return {} as any;
    }
    public static New(): Xml {
        return {} as any;
    }
    public get Node(): XmlNode {
        return {} as any;
    }
    public get Document(): XmlDocument {
        return {} as any;
    }
    public get IsNotNull(): boolean {
        return {} as any;
    }
    public get IsNull(): boolean {
        return {} as any;
    }
    public get IsElement(): boolean {
        return {} as any;
    }
    public get AsElement(): XmlElement {
        return {} as any;
    }
    public get IsAttribute(): boolean {
        return {} as any;
    }
    public get AsAttribute(): XmlAttribute {
        return {} as any;
    }
    public get IsText(): boolean {
        return {} as any;
    }
    public get AsText(): XmlText {
        return {} as any;
    }
    public get IsCData(): boolean {
        return {} as any;
    }
    public get AsCData(): XmlCDataSection {
        return {} as any;
    }
    public get IsEntityReference(): boolean {
        return {} as any;
    }
    public get AsEntityReference(): XmlEntityReference {
        return {} as any;
    }
    public get IsEntity(): boolean {
        return {} as any;
    }
    public get AsEntity(): XmlEntity {
        return {} as any;
    }
    public get IsProcessingInstruction(): boolean {
        return {} as any;
    }
    public get AsProcessingInstruction(): XmlProcessingInstruction {
        return {} as any;
    }
    public get IsComment(): boolean {
        return {} as any;
    }
    public get AsComment(): XmlComment {
        return {} as any;
    }
    public get IsDocumentType(): boolean {
        return {} as any;
    }
    public get AsDocumentType(): XmlDocumentType {
        return {} as any;
    }
    public get IsDocumentFragment(): boolean {
        return {} as any;
    }
    public get AsDocumentFragment(): XmlDocumentFragment {
        return {} as any;
    }
    public get IsNotation(): boolean {
        return {} as any;
    }
    public get AsNotation(): XmlNotation {
        return {} as any;
    }
    public get IsNone(): boolean {
        return {} as any;
    }
    public get IsDocument(): boolean {
        return {} as any;
    }
    public get AsDocument(): XmlDocument {
        return {} as any;
    }
    public get IsEndElement(): boolean {
        return {} as any;
    }
    public get IsEndEntity(): boolean {
        return {} as any;
    }
    public get IsXmlDeclaration(): boolean {
        return {} as any;
    }
    public get AsXmlDeclaration(): XmlDeclaration {
        return {} as any;
    }
    public get IsWhitespace(): boolean {
        return {} as any;
    }
    public get AsWhitespace(): XmlWhitespace {
        return {} as any;
    }
    public get IsSignificantWhitespace(): boolean {
        return {} as any;
    }
    public get AsSignificantWhitespace(): XmlSignificantWhitespace {
        return {} as any;
    }
    public get Name(): string {
        return {} as any;
    }
    public get Children(): Xml[] {
        return {} as any;
    }
    public get AttributeNames(): string[] {
        return {} as any;
    }
    public get AttributeValues(): string[] {
        return {} as any;
    }
    public get Attributes(): XmlAttribute[] {
        return {} as any;
    }
    public get InnerText(): string {
        return {} as any;
    }
    public set InnerText(value: string) {
    }
    public get InnerXml(): string {
        return {} as any;
    }
    public set InnerXml(value: string) {
    }
    public get OuterXml(): string {
        return {} as any;
    }
    public get Item(): Xml {
        return {} as any;
    }
    public get Count(): number {
        return {} as any;
    }
    public get Root(): Xml {
        return {} as any;
    }
}