import GObject from '@girs/gobject-2.0'
import Gtk from '@girs/gtk-4.0'
import Adw from '@girs/adw-1'

import { MessageConsole } from './message-console.ts'
import { HexMonitor } from './hex-monitor.ts'
import { DebugInfo } from './debug-info.ts'

import Template from './debugger.blp'

import { type Debugger as DebuggerInterface, type Memory, type Simulator, DebuggerState, type DebuggerOptions, throttle } from '@easy6502/6502'

export class Debugger extends Adw.Bin implements DebuggerInterface {

  // Properties
  declare private _state: DebuggerState

  // Child widgets
  declare private _stack: Gtk.Stack
  declare private _messageConsole: MessageConsole
  declare private _hexMonitor: HexMonitor
  declare private _debugInfo: DebugInfo
  declare private _statusPage: Adw.StatusPage

  static {
    GObject.registerClass({
      GTypeName: 'Debugger',
      Template,
      InternalChildren: ['stack', 'messageConsole', 'hexMonitor', 'debugInfo', 'statusPage'],
      Properties: {
        // TypeScript enums are numbers by default
        'state': GObject.ParamSpec.uint('state', 'State', 'Debugger state', GObject.ParamFlags.READWRITE, DebuggerState.INITIAL, DebuggerState.RESET, DebuggerState.INITIAL)
      },
    }, this);
  }

  public get state(): DebuggerState {
    return this._state;
  }

  public set state(value: DebuggerState) {
    if (this._state !== value) {
      this._state = value;
      this.notify('state');
    }
  }

  // TODO: Currently unused
  public readonly options: DebuggerOptions = {
    monitor: {
      start: 0x0000,
      length: 0xFFFF
    }
  }

  /** A list of handler IDs for the signals we connect to. */
  private handlerIds: number[] = [];

  constructor(binParams: Partial<Adw.Bin.ConstructorProps> = {}) {
    super(binParams)
    this.setupSignalHandlers();
    this.state = DebuggerState.INITIAL;
  }

  /** Call this when the ApplicationWindow is closed. */
  public close(): void {
    this.removeSignalHandlers();
  }

  public log(message: string): void {
    this._messageConsole.log(message);
  }

  #update(memory: Memory, simulator: Simulator): void {
    this.updateMonitor(memory);
    this.updateDebugInfo(simulator);
  }

  /**
   * Update the debugger.
   * @note This is throttled to 349ms to prevent excessive CPU usage.
   * @param memory - The memory to update the hex monitor.
   * @param simulator - The simulator to update the debug info.
   */
  public update = throttle(this.#update.bind(this), 349); // Prime number

  public updateMonitor(memory: Memory): void {
    this._hexMonitor.update(memory);
  }

  public updateDebugInfo(simulator: Simulator): void {
    this._debugInfo.update(simulator);
  }

  public reset(): void {
    this._messageConsole.clear();
    this.state = DebuggerState.RESET;
  }

  private onStateChanged(): void {
    if(this.state === DebuggerState.INITIAL) {
      this._stack.set_visible_child_name('initial');
    } else  {
      this._stack.set_visible_child_name('debugger');
    }
  }

  private onParamChanged(_self: Debugger, pspec: GObject.ParamSpec): void {
    switch (pspec.name) {
      case 'state':
        this.onStateChanged();
        break;
    }
  }

  private setupSignalHandlers(): void {
    this.handlerIds.push(this.connect('notify', this.onParamChanged.bind(this)));
  }

  private removeSignalHandlers(): void {
    this.handlerIds.forEach(id => this.disconnect(id));
    this.handlerIds = [];
  }
}

GObject.type_ensure(Debugger.$gtype)