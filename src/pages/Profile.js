import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getBalance, editProfile } from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const { email } = userData;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!email) {
      message.error('No se encontró el email del usuario.');
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const balanceResponse = await getBalance(email);
        if (!balanceResponse.success) {
          message.error(balanceResponse.message || 'Error al obtener datos del usuario');
          navigate('/account');
          return;
        }

        const user = balanceResponse.user;
        form.setFieldsValue({
          name: user.name,
          username: user.username,
          // agrega otros campos si quieres mostrar/editarlos
        });
      } catch (error) {
        message.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email, form, navigate]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const response = await editProfile(email, values);
      if (response.success) {
        message.success('Perfil actualizado correctamente');
        // Actualizar localStorage con nuevos datos:
        localStorage.setItem('userData', JSON.stringify(response.user));
        navigate('/account');
      } else {
        message.error(response.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      message.error('Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '30px auto' }} />;

  return (
    <div style={{ maxWidth: 400, margin: '30px auto' }}>
      <h2>Editar Perfil</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
        >
          <Input />
        </Form.Item>

        {/* Si tienes más campos para editar, agrégalos acá */}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Guardar Cambios
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => navigate('/account')}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
