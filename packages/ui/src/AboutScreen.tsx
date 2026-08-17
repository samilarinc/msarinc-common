import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { type Palette } from '@msarinc/theme-core';
import { useTheme } from './ThemeProvider';

export interface AboutContact {
  icon: LucideIcon;
  label: string;
  url: string;
}

export interface AboutProfile {
  /** Görsel URL'i (string) veya React Native ImageSourcePropType (örn. require(...)) kabul eder. */
  avatar: string | ImageSourcePropType;
  name: string;
  role: string;
  contacts: AboutContact[];
}

export interface AboutUpdate {
  date: string;
  bullets: string[];
}

export interface AboutSection {
  title: string;
  /** Düz paragraf bölümü (örn. "Proje Hakkında"). */
  text?: string;
  /** Güncelleme notları bölümü (örn. "Sürüm Notları"). */
  updates?: AboutUpdate[];
}

export interface AboutScreenProps {
  profile: AboutProfile;
  sections: AboutSection[];
}

/** Presentational — metinler i18n çevirisi yapılmış olarak prop'tan gelir. */
export default function AboutScreen({ profile, sections }: AboutScreenProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Image
          source={typeof profile.avatar === 'string' ? { uri: profile.avatar } : profile.avatar}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.role}</Text>

        <View style={styles.divider} />

        {profile.contacts.map((contact) => (
          <TouchableOpacity
            key={contact.url}
            style={styles.infoRow}
            onPress={() => Linking.openURL(contact.url)}
            activeOpacity={0.7}
          >
            <contact.icon color={colors.primary} size={18} style={styles.infoIcon} />
            <Text style={styles.infoLink}>{contact.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          {section.text && <Text style={styles.sectionText}>{section.text}</Text>}

          {section.updates?.map((update) => (
            <View key={update.date} style={styles.updateItem}>
              <Text style={styles.updateDate}>{update.date}</Text>
              <View style={styles.updateList}>
                {update.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.updateBullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const getStyles = (colors: Palette) =>
  StyleSheet.create({
    content: {
      padding: 20,
      paddingBottom: 40,
      alignItems: 'center',
      width: '100%',
      maxWidth: 520,
      alignSelf: 'center',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: { width: 72, height: 72, borderRadius: 18, marginBottom: 12 },
    name: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
    role: { fontSize: 14, fontWeight: '500', color: colors.textMuted, marginTop: 2 },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoIcon: { marginRight: 8 },
    infoLink: { fontSize: 14, color: colors.primary, textDecorationLine: 'underline' },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 20,
      marginBottom: 16,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 8 },
    sectionText: { fontSize: 14, color: colors.textMuted, lineHeight: 21 },
    updateItem: {
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 12,
    },
    updateDate: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
    updateList: { paddingLeft: 2 },
    updateBullet: { fontSize: 14, color: colors.textMuted, lineHeight: 21, marginBottom: 6 },
  });
