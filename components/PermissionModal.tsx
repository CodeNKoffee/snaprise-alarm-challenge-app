import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onGrant: () => void;
  permissionType: 'camera' | 'notifications';
}

export default function PermissionModal({ 
  visible, 
  onClose, 
  onGrant, 
  permissionType 
}: PermissionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const getPermissionInfo = () => {
    if (permissionType === 'camera') {
      return {
        title: 'Camera Access Needed',
        description: "To make sure you're really up, we need camera access to scan your toothbrush, cereal box, or any item you choose!",
        icon: 'camera',
        grantText: 'Allow Camera Access',
      };
    } else {
      return {
        title: 'Notification Access Needed',
        description: 'To wake you up on time, we need permission to send notifications for your alarms.',
        icon: 'bell',
        grantText: 'Allow Notifications',
      };
    }
  };
  
  const { title, description, icon, grantText } = getPermissionInfo();
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <FontAwesome icon={icon} size={40} color="white" />
          </View>
          
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.modalText, { color: colors.text }]}>{description}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel, { borderColor: colors.mediumGray }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.mediumGray }]}>Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonGrant, { backgroundColor: colors.primary }]}
              onPress={onGrant}
            >
              <Text style={styles.buttonText}>{grantText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    minWidth: '45%',
    alignItems: 'center',
  },
  buttonGrant: {
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});