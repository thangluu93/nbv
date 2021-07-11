export interface Item {
  'id': string,
  'quantity': number,
  'editable': boolean,
  'extra'?: Array<ExtraItems>,
  'price': number,
  'name': MultipleLanguage,
  'description'?: MultipleLanguage,
  'price_str': string
}

export interface ExtraItems {
  'code': string,
  'id': string,
  'price_str': string,
  'name': string,
  'price': number,
}

export interface MultipleLanguage {
  vi: string,
  en: string
}
