import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Mail, GitBranch } from 'lucide-react-native';
import { ThemeProvider, ThemeToggle, LanguageSelector, AboutScreen, useTheme } from '@msarinc/ui';
import './src/i18n';

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
];

function Demo() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { t: tc } = useTranslation('common');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
        <View style={styles.headerActions}>
          <LanguageSelector
            value={i18n.language}
            languages={LANGUAGES}
            onChange={(code) => i18n.changeLanguage(code)}
          />
          <ThemeToggle
            includeSystem
            labels={{
              system: tc('theme.system'),
              light: tc('theme.light'),
              dark: tc('theme.dark'),
              lightsOut: tc('theme.lights_out'),
            }}
          />
        </View>
      </View>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('subtitle')}</Text>

      <AboutScreen
        profile={{
          avatar: { uri: 'https://picsum.photos/200' },
          name: 'msarinc-common',
          role: t('role'),
          contacts: [
            { icon: Mail, label: 'msarinc@gmail.com', url: 'mailto:msarinc@gmail.com' },
            { icon: GitBranch, label: 'github.com/samilarinc', url: 'https://github.com/samilarinc' },
          ],
        }}
        sections={[
          { title: t('aboutTitle'), text: t('aboutText') },
          {
            title: t('updatesTitle'),
            updates: [{ date: '2026-08-17', bullets: ['Added the first demo screen.'] }],
          },
        ]}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" waitUntilHydrated>
      <Demo />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, paddingHorizontal: 20, marginTop: 4, marginBottom: 12 },
});
