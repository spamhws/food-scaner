const fs = require('fs');
const path = require('path');

const langs = [
  'en',
  'uk',
  'es',
  'zh',
  'hi',
  'ar',
  'fr',
  'de',
  'pt',
  'id',
  'ja',
  'ko',
  'it',
  'pl',
  'nl',
  'tr',
  'ro',
  'sv',
  'da',
  'cs',
];
const dataDir = path.join('src', 'data');
const transDir = path.join('src', 'translations');

langs.forEach((lang) => {
  const langDir = path.join(transDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const faqSrc = lang === 'en' ? 'faq.json' : lang === 'uk' ? 'faq.uk.json' : `faq.${lang}.json`;
  const uaSrc =
    lang === 'en'
      ? 'userAgreement.json'
      : lang === 'uk'
      ? 'userAgreement.uk.json'
      : `userAgreement.${lang}.json`;
  const ppSrc =
    lang === 'en'
      ? 'privacyPolicy.json'
      : lang === 'uk'
      ? 'privacyPolicy.uk.json'
      : `privacyPolicy.${lang}.json`;

  const files = [
    { src: faqSrc, dest: 'faq.json' },
    { src: uaSrc, dest: 'userAgreement.json' },
    { src: ppSrc, dest: 'privacyPolicy.json' },
  ];

  files.forEach(({ src, dest }) => {
    const srcPath = path.join(dataDir, src);
    const destPath = path.join(langDir, dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${src} to ${lang}/${dest}`);
    } else {
      console.log(`⚠ Warning: ${src} not found`);
    }
  });
});

console.log('\nDone! All files moved to language folders.');
