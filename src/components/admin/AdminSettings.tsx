import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Shield,
  Globe,
  Bell,
  Database,
  Users,
  Settings,
  Save,
  RefreshCw,
  Loader2,
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalArticles: 0,
    totalOpportunities: 0,
  });

  const [settings, setSettings] = useState({
    platformName: 'HandZone',
    contactEmail: 'contato@handzone.com.br',
    autoApproveArticles: false,
    requireEmailVerification: true,
    maxFreeProfiles: 1,
    maintenanceMode: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('handzone_admin_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // More efficient count queries using Supabase count: 'exact', head: true
      const [profilesResult, articlesResult, opportunitiesResult, premiumResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
      ]);

      setStats({
        totalUsers: profilesResult.count || 0,
        premiumUsers: premiumResult.count || 0,
        totalArticles: articlesResult.count || 0,
        totalOpportunities: opportunitiesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as estatísticas.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleSave = () => {
    localStorage.setItem('handzone_admin_settings', JSON.stringify(settings));
    toast({
      title: 'Configurações salvas',
      description: 'As configurações da plataforma foram atualizadas localmente.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Platform Stats */}
      <div className="glass-card rounded-2xl p-6 border-accent-glow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Estatísticas do Banco de Dados
          </h3>
          <Button variant="ghost" size="sm" onClick={fetchStats} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground">Usuários Totais</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.premiumUsers}</p>
            <p className="text-xs text-muted-foreground">Usuários Premium</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalArticles}</p>
            <p className="text-xs text-muted-foreground">Notícias</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalOpportunities}</p>
            <p className="text-xs text-muted-foreground">Oportunidades</p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          Configurações Gerais
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Nome da Plataforma</Label>
            <Input
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Email de Contato</Label>
            <Input
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          Segurança e Acesso
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Verificação de Email Obrigatória</p>
              <p className="text-sm text-muted-foreground">Novos usuários devem verificar o email antes de acessar.</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(v) => setSettings({ ...settings, requireEmailVerification: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Aprovação Automática de Notícias</p>
              <p className="text-sm text-muted-foreground">Publicar notícias automaticamente sem moderação.</p>
            </div>
            <Switch
              checked={settings.autoApproveArticles}
              onCheckedChange={(v) => setSettings({ ...settings, autoApproveArticles: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Modo de Manutenção</p>
              <p className="text-sm text-muted-foreground">Bloqueia acesso de usuários não-admin à plataforma.</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          Notificações
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificar novos cadastros</p>
              <p className="text-sm text-muted-foreground">Receber alerta quando um novo usuário se cadastrar.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificar novas notícias pendentes</p>
              <p className="text-sm text-muted-foreground">Receber alerta quando uma notícia for enviada para moderação.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificar solicitações de parceria</p>
              <p className="text-sm text-muted-foreground">Receber alerta de novos contatos de parceria.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="hero" size="lg" className="gap-2" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
