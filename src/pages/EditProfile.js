import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { editUserProfile, changeUserEmail } from '../services/authService';

const EditProfile = () => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { email: currentEmail, name: currentName, username: currentUsername } = userData;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: currentName,
      username: currentUsername,
      email: currentEmail,
    });
  }, [currentName, currentUsername, currentEmail, form]);

  const onFinish = async (values) => {
    const { name, username, email } = values;

    if (name && name.length > 100) {
      message.error('El nombre no puede tener más de 100 caracteres.');
      return;
    }
    if (username && !/^[a-z0-9._-]{3,30}$/.test(username)) {
      message.error('El nombre de usuario solo puede contener letras minúsculas, números, puntos, guiones y guiones bajos, entre 3 y 30 caracteres.');
      return;
    }

    setLoading(true);

    // Actualizar perfil (name y username)
    const response = await editUserProfile({ email: currentEmail, name, username });

    if (response.success) {
      if (response.changes.length === 0) {
        message.info('No se detectaron cambios en nombre ni usuario.');
      } else {
        message.success(response.message);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
    } else {
      message.error(response.message || 'Error actualizando perfil.');
      setLoading(false);
      return;
    }

    // Si cambió el email
    if (email !== currentEmail) {
      const totpToken = prompt('Ingresá el código TOTP para confirmar el cambio de email:');
      if (!totpToken) {
        message.warning('Cambio de email cancelado.');
        setLoading(false);
        return;
      }

      const emailResponse = await changeUserEmail({
        username: username || currentUsername,
        newEmail: email,
        totpToken,
      });

      if (emailResponse.success) {
        message.success(emailResponse.message);
        const updatedUserData = { ...response.user, email: emailResponse.user.email };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      } else {
        message.error(emailResponse.message || 'Error actualizando email.');
      }
    }

    setLoading(false);
  };

  return (
    <Card title="Editar Perfil" style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Nombre" name="name" rules={[{ max: 100, message: 'Máximo 100 caracteres.' }]}>
          <Input placeholder="Nombre completo" />
        </Form.Item>

        <Form.Item
          label="Alias"
          name="username"
          rules={[
            { required: true, message: 'El alias es obligatorio' },
            { pattern: /^[a-z0-9._-]{3,30}$/, message: 'Solo letras minúsculas, números, puntos, guiones y guiones bajos. 3-30 caracteres.' }
          ]}
        >
          <Input placeholder="Alias" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Debe ser un email válido.' },
            { required: true, message: 'El email es obligatorio.' }
          ]}
        >
          <Input placeholder="email@ejemplo.com" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditProfile;
