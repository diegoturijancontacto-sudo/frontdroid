import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Configuración por defecto
const DEFAULT_IP = '192.168.1.162';
const DEFAULT_PORT = '8080';

export default function EditorScreen(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];

  // Estado del editor
  const [htmlCode, setHtmlCode] = useState<string>(
    '<h1>¡Hola desde mi iPhone!</h1>\n<p>Servidor activo en LG P350f.</p>'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [serverIp, setServerIp] = useState<string>(DEFAULT_IP);
  const [serverPort, setServerPort] = useState<string>(DEFAULT_PORT);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Construir URL base
  const BASE_URL = `http://${serverIp}:${serverPort}`;

  // Colores dinámicos
  const backgroundColor = isDark ? '#0a0e1a' : '#F2F2F7';
  const headerBg = isDark ? '#141b2d' : '#F2F2F7';
  const headerBorder = isDark ? '#1e2a3a' : '#E5E5EA';
  const editorBg = isDark ? '#1C1C1E' : '#ffffff';
  const editorHeaderBg = isDark ? '#2C2C2E' : '#f0f0f0';
  const editorBorder = isDark ? '#3A3A3C' : '#E5E5EA';
  const textColor = isDark ? '#E5E5EA' : '#1C1C1E';
  const secondaryText = isDark ? '#8E8E93' : '#8E8E93';
  const lineNumberColor = isDark ? '#636366' : '#8E8E93';
  const inputBg = isDark ? '#1C1C1E' : '#ffffff';
  const modalBg = isDark ? '#141b2d' : '#ffffff';
  const modalBorder = isDark ? '#1e2a3a' : '#E5E5EA';

  // Actualizar código
  const updateLineNumbers = (text: string) => {
    setHtmlCode(text);
  };

  // Enviar HTML al LG
  const guardarHTML = async (): Promise<void> => {
    if (!htmlCode.trim()) {
      Alert.alert('Error', 'El contenido HTML no puede estar vacío.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cgi-bin/guardar.sh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: htmlCode,
      });

      const result = await response.text();

      if (response.ok && result.includes('OK')) {
        Alert.alert('Éxito', 'El sitio web ha sido actualizado en el LG P350f.');
      } else {
        Alert.alert('Respuesta del Servidor', result || 'Sin respuesta.');
      }
    } catch (error) {
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor LG. Revisa que estén en la misma red Wi-Fi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Alternar estado
  const cambiarEstado = async (estado: 'on' | 'off'): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cgi-bin/estado.sh?status=${estado}`);
      const result = await response.text();

      if (response.ok) {
        Alert.alert('Servidor LG', `Estado cambiado: ${result.trim()}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del sitio.');
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración
  const guardarConfiguracion = () => {
    // Validar IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(serverIp)) {
      Alert.alert('Error', 'Dirección IP inválida');
      return;
    }
    // Validar puerto
    const portNum = parseInt(serverPort);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      Alert.alert('Error', 'Puerto inválido (1-65535)');
      return;
    }
    setModalVisible(false);
    Alert.alert('Configuración guardada', `Servidor: ${BASE_URL}`);
  };

  // Obtener número de líneas
  const lineCount = htmlCode.split('\n').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: headerBg,
        borderBottomColor: headerBorder
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <IconSymbol size={28} name="doc.text" color={colors.tint} />
            <View>
              <Text style={[styles.title, { color: isDark ? '#E5E5EA' : '#1C1C1E' }]}>
                Editor HTML
              </Text>
              <Text style={[styles.subtitle, { color: secondaryText }]}>
                {BASE_URL}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.configButton, { borderColor: colors.tint }]}
            onPress={() => setModalVisible(true)}
          >
            <IconSymbol size={20} name="gear" color={colors.tint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor de código */}
      <View style={[styles.editorContainer, {
        backgroundColor: editorBg,
        shadowColor: isDark ? '#000' : '#000',
      }]}>
        <View style={[styles.editorHeader, {
          backgroundColor: editorHeaderBg,
          borderBottomColor: editorBorder
        }]}>
          <View style={styles.dotGroup}>
            <View style={[styles.dot, styles.dotRed]} />
            <View style={[styles.dot, styles.dotYellow]} />
            <View style={[styles.dot, styles.dotGreen]} />
          </View>
          <Text style={[styles.fileName, { color: secondaryText }]}>index.html</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.editorScroll}
          contentContainerStyle={styles.editorContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.codeContainer}>
            {/* Números de línea */}
            <View style={[styles.lineNumbersContainer, {
              backgroundColor: editorBg,
              borderRightColor: editorBorder
            }]}>
              {Array.from({ length: lineCount }, (_, i) => (
                <Text key={i} style={[styles.lineNumberText, { color: lineNumberColor }]}>
                  {i + 1}
                </Text>
              ))}
            </View>

            {/* Área de código editable */}
            <TextInput
              style={[styles.codeInput, {
                color: textColor,
                backgroundColor: inputBg
              }]}
              multiline
              value={htmlCode}
              onChangeText={updateLineNumbers}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              selectionColor={colors.tint}
              cursorColor={colors.tint}
              placeholder="Escribe tu código HTML aquí..."
              placeholderTextColor={lineNumberColor}
            />
          </View>
        </ScrollView>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.btnPrimary, loading && styles.disabled]}
          onPress={guardarHTML}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <IconSymbol size={20} name="icloud.and.arrow.up" color="#fff" />
              <Text style={styles.btnText}>Subir al LG</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[styles.button, styles.btnSuccess, styles.statusButton]}
            onPress={() => cambiarEstado('on')}
            disabled={loading}
          >
            <IconSymbol size={18} name="play.fill" color="#fff" />
            <Text style={styles.btnText}>Encender</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.btnDanger, styles.statusButton]}
            onPress={() => cambiarEstado('off')}
            disabled={loading}
          >
            <IconSymbol size={18} name="stop.fill" color="#fff" />
            <Text style={styles.btnText}>Apagar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Configuración */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, {
            backgroundColor: modalBg,
            borderColor: modalBorder
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#E5E5EA' : '#1C1C1E' }]}>
                Configuración del Servidor
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol size={24} name="xmark" color={isDark ? '#8E8E93' : '#8E8E93'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: isDark ? '#E5E5EA' : '#1C1C1E' }]}>
                  <IconSymbol size={16} name="wifi" color={colors.tint} /> Dirección IP
                </Text>
                <TextInput
                  style={[styles.input, {
                    color: textColor,
                    backgroundColor: isDark ? '#0a0e1a' : '#f5f5f5',
                    borderColor: modalBorder
                  }]}
                  value={serverIp}
                  onChangeText={setServerIp}
                  placeholder="192.168.1.162"
                  placeholderTextColor={lineNumberColor}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: isDark ? '#E5E5EA' : '#1C1C1E' }]}>
                  <IconSymbol size={16} name="number" color={colors.tint} /> Puerto
                </Text>
                <TextInput
                  style={[styles.input, {
                    color: textColor,
                    backgroundColor: isDark ? '#0a0e1a' : '#f5f5f5',
                    borderColor: modalBorder
                  }]}
                  value={serverPort}
                  onChangeText={setServerPort}
                  placeholder="8080"
                  placeholderTextColor={lineNumberColor}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalInfo}>
                <IconSymbol size={16} name="info.circle" color={colors.tint} />
                <Text style={[styles.modalInfoText, { color: secondaryText }]}>
                  Asegúrate de que el LG esté en la misma red Wi-Fi
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.btnSecondary, styles.modalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.btnTextSecondary, { color: isDark ? '#E5E5EA' : '#1C1C1E' }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.btnPrimary, styles.modalButton]}
                onPress={guardarConfiguracion}
              >
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 1,
    fontFamily: 'monospace',
  },
  configButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editorContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  dotGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotRed: {
    backgroundColor: '#FF5F56',
  },
  dotYellow: {
    backgroundColor: '#FFBD2E',
  },
  dotGreen: {
    backgroundColor: '#27C93F',
  },
  fileName: {
    fontSize: 12,
    fontWeight: '500',
  },
  editorScroll: {
    flex: 1,
  },
  editorContent: {
    flexGrow: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 300,
  },
  lineNumbersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    minHeight: '100%',
  },
  lineNumberText: {
    fontSize: 14,
    fontFamily: 'Menlo',
    lineHeight: 22,
    textAlign: 'right',
    includeFontPadding: false,
  },
  codeInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: 'Menlo',
    lineHeight: 22,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: '#007AFF',
  },
  btnSuccess: {
    backgroundColor: '#34C759',
  },
  btnDanger: {
    backgroundColor: '#FF3B30',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  btnTextSecondary: {
    fontWeight: '600',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  modalInfoText: {
    fontSize: 13,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
