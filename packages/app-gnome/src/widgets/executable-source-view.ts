import GObject from '@girs/gobject-2.0'
import Adw from '@girs/adw-1'
import Gtk from '@girs/gtk-4.0'
import { SourceView } from './source-view.ts'

import Template from './executable-source-view.ui?raw'

GObject.type_ensure(SourceView.$gtype)

export interface ExecutableSourceView {
  // Child widgets
  _scrolledWindow: Gtk.ScrolledWindow
  /** The SourceView that displays the buffer's display */
  _sourceView: SourceView
}

/**
 * @class ExecutableSourceView to display 6502 assembly code that can be executed
 * 
 * @emits changed - Emitted when the buffer's text changes
 */
export class ExecutableSourceView extends Adw.Bin {

  static {
    GObject.registerClass({
      GTypeName: 'ExecutableSourceView',
      Template,
      InternalChildren: ['sourceView'],
      Signals: {
        'changed': {
          param_types: [],
        },
      },
      Properties: {
        code: GObject.ParamSpec.string('code', 'Code', 'The source code of the editor', GObject.ParamFlags.READWRITE, ''),
        language: GObject.ParamSpec.string('language', 'Language', 'The language of the source view', GObject.ParamFlags.READWRITE, ''),
        readonly: GObject.ParamSpec.boolean('readonly', 'Readonly', 'Whether the source view is readonly', GObject.ParamFlags.READWRITE, false),
        editable: GObject.ParamSpec.boolean('editable', 'Editable', 'Whether the source view is editable', GObject.ParamFlags.READWRITE, true),
        selectable: GObject.ParamSpec.boolean('selectable', 'Focusable', 'Whether the source view is selectable', GObject.ParamFlags.READWRITE, true),
        unselectable: GObject.ParamSpec.boolean('unselectable', 'Unselectable', 'Whether the source view is unselectable', GObject.ParamFlags.READWRITE, false),
        lineNumbers: GObject.ParamSpec.boolean('line-numbers', 'Line Numbers', 'Whether the source view has line numbers', GObject.ParamFlags.READWRITE, true),
        noLineNumbers: GObject.ParamSpec.boolean('no-line-numbers', 'No Line Numbers', 'Whether the source view has no line numbers', GObject.ParamFlags.READWRITE, false),
        hexpand: GObject.ParamSpec.boolean('hexpand', 'Hexpand', 'Whether the source view is hexpand', GObject.ParamFlags.READWRITE, true),
        vexpand: GObject.ParamSpec.boolean('vexpand', 'Vexpand', 'Whether the source view is vexpand', GObject.ParamFlags.READWRITE, true),
        fitContentHeight: GObject.ParamSpec.boolean('fit-content-height', 'Fit Content Height', 'Whether the source view should fit the content height', GObject.ParamFlags.READWRITE, false),
        fitContentWidth: GObject.ParamSpec.boolean('fit-content-width', 'Fit Content Width', 'Whether the source view should fit the content width', GObject.ParamFlags.READWRITE, false),
      },
    }, this);
  }

  public set code(value: string) {
    this._sourceView.code = value;
    this.onUpdate();
  }

  public get code(): string {
    return this._sourceView.code;
  }


  /**
   * Set the readonly property of the source view
   * 
   * @param value - Whether the source view is readonly
   */
  public set readonly(value: boolean) {
    this._sourceView.editable = !value;
  }

  /**
   * Get the readonly property of the source view
   * 
   * @returns Whether the source view is readonly
   */
  public get readonly(): boolean {
    return !this.editable;
  }

  /**
   * Set the editable property of the source view
   * 
   * @param value - Whether the source view is editable
   */
  public set editable(value: boolean) {
    this._sourceView.editable = value;
  }

  /**
   * Get the editable property of the source view
   * 
   * @returns Whether the source view is editable
   */
  public get editable(): boolean {
    return this._sourceView.editable;
  }

  /**
   * Set the language of the source view
   * 
   * @param language - The language of the source view, e.g. '6502-assembler'
   */
  public set language(language: string) {
    this._sourceView.language = language;
  }

  /**
   * Get the language of the source view
   * 
   * @returns The language of the source view, e.g. '6502-assembler'
   */
  public get language(): string {
    return this._sourceView.language ?? '';
  }

  /**
   * Set the selectable property of the source view
   * 
   * @param value - Whether the source view is selectable
   */
  public set selectable(value: boolean) {
    this._sourceView.selectable = value;
  }

  /**
   * Get the selectable property of the source view
   * 
   * @returns Whether the source view is selectable
   */
  public get selectable(): boolean {
    return this._sourceView.selectable;
  }
  
  /**
   * Set the unselectable property of the source view
   * 
   * @param value - Whether the source view is unselectable
   */
  public set unselectable(value: boolean) {
    this.selectable = !value;
  }

  /**
   * Get the unselectable property of the source view
   * 
   * @returns Whether the source view is unselectable
   */
  public get unselectable(): boolean {
    return !this.selectable;
  }

  /**
   * Set the line numbers property of the source view
   * 
   * @param value - Whether the source view has line numbers
   */
  public set lineNumbers(value: boolean) {
    this._sourceView.lineNumbers = value;
  }

  /**
   * Get the line numbers property of the source view
   * 
   * @returns Whether the source view has line numbers
   */
  public get lineNumbers(): boolean {
    return this._sourceView.lineNumbers;
  }

  /**
   * Set the no line numbers property of the source view
   * 
   * @param value - Whether the source view has no line numbers
   */
  public set noLineNumbers(value: boolean) {
    this.lineNumbers = !value;
  }

  /**
   * Get the no line numbers property of the source view
   * 
   * @returns Whether the source view has no line numbers
   */
  public get noLineNumbers(): boolean {
    return !this.lineNumbers;
  }

  /**
   * Set the fitContentHeight property of the source view.
   * This property is used to fit the content height of the source view and to disable vertical scrolling.
   * 
   * @param value - Whether the source view should fit the content height
   */
  public set fitContentHeight(value: boolean) {
    this._sourceView.fitContentHeight = value;
  }

  /**
   * Set the fitContentWidth property of the source view.
   * This property is used to fit the content width of the source view and to disable horizontal scrolling.
   * 
   * @param value - Whether the source view should fit the content width
   */
  public set fitContentWidth(value: boolean) {
    this._sourceView.fitContentWidth = value;
  }

  constructor(params: Partial<Adw.Bin.ConstructorProps>) {
    super(params)
  }

  private onUpdate() {
    this.emit("changed");
  };

}