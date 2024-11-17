/**
 * Configuration options for the xgettext plugin
 * Used to extract translatable strings from source files
 */
export interface XGettextPluginOptions {
  /** Glob patterns for source files to extract strings from */
  sources: string[];
  /** Output path for the POT template file */
  output: string;
  /** The gettext domain name, defaults to 'messages' */
  domain?: string;
  /** Keywords to look for when extracting strings, defaults to ['_', 'gettext', 'ngettext'] */
  keywords?: string[];
  /** Additional options to pass to xgettext command */
  xgettextOptions?: string[];
  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Configuration options for the gettext plugin
 * Used to compile PO files to binary MO format
 */
export interface GettextPluginOptions {
  /** Directory containing PO translation files */
  poDirectory: string;
  /** Output directory for compiled MO files */
  moDirectory: string;
  /** Enable verbose logging */
  verbose?: boolean;
}