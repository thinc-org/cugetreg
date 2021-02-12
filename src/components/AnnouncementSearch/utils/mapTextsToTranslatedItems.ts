import { TFunction } from 'i18next'

/**
 * Map aray to texts to the following namespace
 * @param namespace name space from locale
 * @param texts array of texts to be mapped to locale
 * @param t translate, from useTranslation()
 * @param subNamespace needed when namespace in locale is subnamespace for example, t('category.HU')
 */
const mapTextsToTranslatedItems = (namespace: string, texts: string[], t: TFunction, subNamespace?: string) => {
  return texts.map((text) => {
    const textForI18n = subNamespace ? `${subNamespace}.${text}` : text
    return {
      value: text,
      translatedText: t(`${namespace}:${textForI18n}` as const),
    }
  })
}

export default mapTextsToTranslatedItems
