# 9-Language Instant Frame-1 Localization Architecture

Both **Smarter Than a 7-Year-Old IQ** and the studio shell are engineered for global accessibility across **9 languages** covering Europe, East Africa, the Middle East, the Americas, and East Asia.

---

## 1. Supported Languages & Scripts

| Priority | Locale Code | Native Label | English Name | Script & Layout |
| :---: | :---: | :--- | :--- | :--- |
| 1 | `en` | English | English | Latin (`LTR`) |
| 2 | `am` | አማርኛ | Amharic | Ge'ez / Ethiopic (`LTR`) |
| 3 | `de` | Deutsch | German | Latin (`LTR`) |
| 4 | `so` | Soomaali | Somali | Latin (`LTR`) |
| 5 | `ar` | العربية | Arabic | Arabic (`RTL`) |
| 6 | `es` | Español | Spanish | Latin (`LTR`) |
| 7 | `fr` | Français | French | Latin (`LTR`) |
| 8 | `pt` | Português | Portuguese | Latin (`LTR`) |
| 9 | `ja` | 日本語 | Japanese | Kanji / Hiragana / Katakana (`LTR`) |

---

## 2. Design Principles (`src/constants/smarter7yoI18n.ts`)

1. **Frame-1 Welcome Language Picker**: On first launch, the language selection sheet renders synchronously on Frame 1 (`useState`) without blocking on asynchronous storage reads, allowing non-English speakers to select their native language on their very first tap.
2. **Persistent `🌐` Header Switcher**: Users can switch languages mid-session from the top header bar without losing active game progress, streak counters, or earned badges.
3. **Complete Domain Translation**: Localizes not only UI chrome and buttons, but also category labels, classmate hints, report card metrics, lifeline explanations, and store listing metadata (`<= 30` char titles and `<= 80` char short descriptions).
