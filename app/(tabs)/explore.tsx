// app/index.js
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const handleUrlPress = (url) => {
    // Aquí puedes implementar la apertura de URL
    console.log('Abrir:', url);
  };

  // Definir colores de fondo según el tema
  const backgroundColor = isDark ? '#0a0e1a' : '#f8f9fa';
  const cardBackground = isDark ? '#141b2d' : '#ffffff';
  const cardBorder = isDark ? '#1e2a3a' : '#e1e5eb';
  const codeBackground = isDark ? '#0a0e1a' : '#f0f2f5';
  const textColor = isDark ? '#e8edf5' : '#1a1a2e';
  const secondaryTextColor = isDark ? '#b0c0d0' : '#4a4a5e';
  const codeTextColor = isDark ? '#7bed9f' : '#2d8a4e';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <IconSymbol size={40} name="server.rack" color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: textColor }]}>
            Servidor Web Local
          </Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            LG P350f - Sin usar PC
          </Text>
        </View>

        {/* Requisitos Previos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol size={22} name="checklist" color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Requisitos Previos
            </Text>
          </View>
          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            {[
              'Dispositivo: LG P350f (o similar con Android antiguo)',
              'Acceso Root: El teléfono debe estar rooteado',
              'BusyBox instalado: Tener los binarios de BusyBox',
              'Aplicación Terminal: Terminal Emulator instalada',
              'Red Wi-Fi: Misma red que el dispositivo cliente'
            ].map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <IconSymbol size={16} name="circle.fill" color={colors.tint} />
                <Text style={[styles.text, { color: secondaryTextColor }]}>
                  {req}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ¿De qué trata esto? */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol size={22} name="lightbulb" color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿De qué trata esto?
            </Text>
          </View>
          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.text, { color: secondaryTextColor }]}>
              Convertiremos tu teléfono LG antiguo en un servidor web local usando{' '}
              <Text style={[styles.bold, { color: textColor }]}>BusyBox</Text>.
              El teléfono guardará un sitio web en su memoria interna y quedará 
              escuchando peticiones para que cualquier cambio que quieras hacerle 
              a la página pueda actualizarse al instante.
            </Text>
          </View>
        </View>

        {/* Paso a Paso */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol size={22} name="gear" color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Paso a Paso
            </Text>
          </View>
          
          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              1. Obtener permisos de Administrador
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                su
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              2. Crear las carpetas de trabajo
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                mkdir -p /data/local/www/cgi-bin
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              3. Crear la página inicial de prueba
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                echo "&lt;h1&gt;Servidor Local LG P350f&lt;/h1&gt;" &gt; /data/local/www/index.html
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              4. Crear el script receptor (guardar.sh)
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                cat &lt;&lt; 'EOF' &gt; /data/local/www/cgi-bin/guardar.sh{'\n'}
                #!/system/bin/sh{'\n'}
                echo "Content-Type: text/plain"{'\n'}
                echo "Access-Control-Allow-Origin: *"{'\n'}
                echo ""{'\n'}{'\n'}
                if [ "$REQUEST_METHOD" = "POST" ]; then{'\n'}
                    cat &gt; /data/local/www/index.html{'\n'}
                    echo "OK: HTML Actualizado"{'\n'}
                else{'\n'}
                    echo "Error: Se esperaba POST"{'\n'}
                fi{'\n'}
                EOF
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              5. Crear el script de estado (estado.sh)
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                cat &lt;&lt; 'EOF' &gt; /data/local/www/cgi-bin/estado.sh{'\n'}
                #!/system/bin/sh{'\n'}
                echo "Content-Type: text/plain"{'\n'}
                echo "Access-Control-Allow-Origin: *"{'\n'}
                echo ""{'\n'}{'\n'}
                STATUS=$(echo "$QUERY_STRING" | sed -n 's/.*status=\([^&]*\).*/\1/p'){'\n'}{'\n'}
                if [ "$STATUS" = "off" ]; then{'\n'}
                    touch /data/local/www/MANTENIMIENTO{'\n'}
                    echo "Sitio Apagado"{'\n'}
                elif [ "$STATUS" = "on" ]; then{'\n'}
                    rm -f /data/local/www/MANTENIMIENTO{'\n'}
                    echo "Sitio Encendido"{'\n'}
                else{'\n'}
                    echo "Estado no valido"{'\n'}
                fi{'\n'}
                EOF
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              6. Dar permisos de ejecución
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                chmod -R 777 /data/local/www
              </Text>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <Text style={[styles.stepTitle, { color: colors.tint }]}>
              7. Iniciar el Servidor Web
            </Text>
            <View style={[styles.codeBlock, { 
              backgroundColor: codeBackground,
            }]}>
              <Text style={[styles.codeText, { color: codeTextColor }]}>
                busybox pkill httpd || busybox pkill busybox{'\n'}
                busybox httpd -p 8080 -h /data/local/www
              </Text>
            </View>
          </View>
        </View>

        {/* Cómo probar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol size={22} name="wifi" color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              ¿Cómo probar que funciona?
            </Text>
          </View>
          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <View style={styles.requirementItem}>
              <IconSymbol size={16} name="1.square" color={colors.tint} />
              <Text style={[styles.text, { color: secondaryTextColor }]}>
                Conecta el otro dispositivo a la <Text style={[styles.bold, { color: textColor }]}>misma red Wi-Fi</Text>
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol size={16} name="2.square" color={colors.tint} />
              <Text style={[styles.text, { color: secondaryTextColor }]}>
                Revisa la IP local del LG (ej: <Text style={[styles.codeInline, { 
                  backgroundColor: codeBackground,
                  color: codeTextColor 
                }]}>192.168.1.162</Text>)
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol size={16} name="3.square" color={colors.tint} />
              <Text style={[styles.text, { color: secondaryTextColor }]}>
                Abre el navegador e ingresa:
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.urlContainer, { 
                backgroundColor: codeBackground,
                borderColor: colors.tint,
              }]}
              onPress={() => handleUrlPress('http://192.168.1.162:8080/index.html')}
            >
              <IconSymbol size={20} name="link" color={colors.tint} />
              <Text style={[styles.urlText, { color: colors.tint }]}>
                http://192.168.1.162:8080/index.html
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Consejos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol size={22} name="exclamationmark.triangle" color={colors.tint} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Consejos prácticos
            </Text>
          </View>
          <View style={[styles.card, { 
            backgroundColor: cardBackground,
            borderColor: cardBorder
          }]}>
            <View style={styles.tipItem}>
              <IconSymbol size={18} name="lightbulb.fill" color={colors.tint} />
              <Text style={[styles.text, { color: secondaryTextColor }]}>
                <Text style={[styles.bold, { color: textColor }]}>Pantalla siempre encendida:</Text>{' '}
                Activa en Opciones de desarrollador mientras esté cargando
              </Text>
            </View>
            <View style={styles.tipItem}>
              <IconSymbol size={18} name="lightbulb.fill" color={colors.tint} />
              <Text style={[styles.text, { color: secondaryTextColor }]}>
                <Text style={[styles.bold, { color: textColor }]}>Ubicación de archivos:</Text>{' '}
                Usa <Text style={[styles.codeInline, { 
                  backgroundColor: codeBackground,
                  color: codeTextColor 
                }]}>/data/local/www</Text> (evita la SD por permisos)
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: isDark ? '#1e2a3a' : '#e1e5eb' }]}>
          <IconSymbol size={20} name="server.rack" color={isDark ? '#556677' : '#8a9aa8'} />
          <Text style={[styles.footerText, { color: isDark ? '#556677' : '#8a9aa8' }]}>
            Servidor Web LG P350f
            Por: Diego Turijan
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginTop: 20,
    marginBottom: 28,
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    gap: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  codeBlock: {
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  codeInline: {
    fontFamily: 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urlContainer: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  urlText: {
    fontSize: 14,
    fontFamily: 'monospace',
    textDecorationLine: 'underline',
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
    gap: 10,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
  },
});