import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Mail, Github } from 'lucide-react-native';
import { ThemeProvider, ThemeToggle, AboutScreen, useTheme, type Palette } from '@msarinc/ui';
import './src/i18n';

function LangSwitch({ colors }: { colors: Palette }) {
  const { i18n } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.langBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
    >
      <Text style={{ color: colors.text, fontWeight: '600' }}>{i18n.language === 'tr' ? 'EN' : 'TR'}</Text>
    </TouchableOpacity>
  );
}

function Demo() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { t: tc } = useTranslation('common');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
        <View style={styles.headerActions}>
          <LangSwitch colors={colors} />
          <ThemeToggle
            labels={{
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
            { icon: Github, label: 'github.com/samilarinc', url: 'https://github.com/samilarinc' },
          ],
        }}
        sections={[
          { title: t('aboutTitle'), text: t('aboutText') },
          {
            title: t('updatesTitle'),
            updates: [{ date: '2026-08-17', bullets: ['İlk demo ekranı eklendi.'] }],
          },
        ]}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
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
  langBtn: { fontWeight: '600', paddingHorizontal: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, paddingHorizontal: 20, marginTop: 4, marginBottom: 12 },
});
