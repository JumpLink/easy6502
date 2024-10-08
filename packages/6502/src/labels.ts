import { EventDispatcher } from './event-dispatcher.js';
import type { Symbols, LabelsEvent } from './types/index.js';
import type { Assembler } from './assembler.js';

/**
 * Manages labels for the 6502 assembler.
 */
export class Labels {
  private labelIndex: string[] = [];
  private readonly events = new EventDispatcher<LabelsEvent>();

  /**
   * Creates a new Labels instance.
   */
  constructor() {}

  public on(event: 'labels-info' | 'labels-failure', listener: (event: LabelsEvent) => void): void {
    this.events.on(event, listener);
  }

  public off(event: 'labels-info' | 'labels-failure', listener: (event: LabelsEvent) => void): void {
    this.events.off(event, listener);
  }

  public once(event: 'labels-info' | 'labels-failure', listener: (event: LabelsEvent) => void): void {
    this.events.once(event, listener);
  }

  /**
   * Checks if a label exists.
   * @param name - Label name to find.
   * @returns True if label exists, false otherwise.
   */
  public find(name: string): boolean {
    return this.labelIndex.some(label => label.split('|')[0] === name);
  }

  /**
   * Associates a label with an address.
   * @param name - Label name.
   * @param addr - Address to associate with the label.
   * @returns True if label was found and updated, false otherwise.
   */
  public setPC(name: string, addr: number): boolean {
    const index = this.labelIndex.findIndex(label => label.split('|')[0] === name);
    if (index !== -1) {
      this.labelIndex[index] = `${name}|${addr}`;
      return true;
    }
    return false;
  }

  /**
   * Gets the address associated with a label.
   * @param name - Label name.
   * @returns The address associated with the label, or -1 if not found.
   */
  public getPC(name: string): number {
    const label = this.labelIndex.find(label => label.split('|')[0] === name);
    return label ? Number(label.split('|')[1]) : -1;
  }

  /**
   * Displays a message about the number of labels found.
   */
  public displayMessage(): void {
    const count = this.labelIndex.length;
    const plural = count !== 1 ? 's' : '';
    this.dispatchInfo(`Found ${count} label${plural}.`);
  }

  /**
   * Resets the label index.
   */
  public reset(): void {
    this.labelIndex = [];
  }

  /**
   * Indexes labels from assembly code lines.
   * @param lines - Array of assembly code lines.
   * @param symbols - Symbols object for lookup.
   * @param assembler - Assembler instance.
   * @returns True if indexing was successful, false otherwise.
   */
  public indexLines(lines: string[], symbols: Symbols, assembler: Assembler): boolean {
    this.dispatchInfo('Indexing labels...');
    for (let i = 0; i < lines.length; i++) {
      if (!this.indexLine(lines[i], symbols, assembler)) {
        this.dispatchFailure(`**Label already defined at line ${i + 1}:** ${lines[i]}`);
        return false;
      }
    }
    return true;
  }

  private dispatchInfo(message: string) {
    this.events.dispatch('labels-info', { labels: this, message });
  }

  private dispatchFailure(message: string) {
    this.events.dispatch('labels-failure', { labels: this, message });
  }

  /**
   * Extracts label from a line and calculates its position in memory.
   * @param input - Single line of assembly code.
   * @param symbols - Symbols object for lookup.
   * @param assembler - Assembler instance.
   * @returns False if label already exists, true otherwise.
   */
  private indexLine(input: string, symbols: Symbols, assembler: Assembler): boolean {
    const currentPC = assembler.getCurrentPC();
    assembler.assembleLine(input, 0, symbols); // TODO: find a better way for Labels to have access to assembler

    if (input.match(/^\w+:/)) {
      const label = input.replace(/(^\w+):.*$/, "$1");
      
      if (symbols.lookup(label)) {
        this.dispatchFailure(`**Label ${label} is already used as a symbol; please rename one of them**`);
        return false;
      }
      
      return this.push(`${label}|${currentPC}`);
    }
    return true;
  }

  /**
   * Adds a label to the index.
   * @param name - Label name and address separated by '|'.
   * @returns False if label already exists, true otherwise.
   */
  private push(name: string): boolean {
    if (this.find(name.split('|')[0])) {
      return false;
    }
    this.labelIndex.push(`${name}|`);
    return true;
  }
}