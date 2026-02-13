import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Loader2, Handshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PartnershipRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  partnership_type: string;
  message: string;
  status: string;
  created_at: string;
}

const PartnershipManagement = () => {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar solicitações");
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    const channel = supabase
      .channel('partnership-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'partnership_requests' }, () => fetchRequests())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('partnership_requests')
      .update({ status } as any)
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success(`Status atualizado para: ${status}`);
      fetchRequests();
    }
  };

  const typeLabels: Record<string, string> = {
    patrocinio: "Patrocínio",
    parceria: "Parceria Comercial",
    publicidade: "Publicidade",
    investimento: "Investimento",
    outro: "Outro",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Handshake className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Solicitações de Parceria ({requests.length})</h3>
      </div>

      {requests.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
          Nenhuma solicitação de parceria recebida.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold">{req.company_name}</h4>
                  <Badge className={statusColors[req.status] || statusColors.pending}>
                    {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{req.contact_name} · {req.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {typeLabels[req.partnership_type] || req.partnership_type} · {new Date(req.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedRequest(req)}>
                  <Eye className="w-4 h-4 mr-1" /> Ver
                </Button>
                {req.status === 'pending' && (
                  <>
                    <Button size="sm" variant="default" onClick={() => updateStatus(req.id, 'approved')}>
                      <Check className="w-4 h-4 mr-1" /> Aprovar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(req.id, 'rejected')}>
                      <X className="w-4 h-4 mr-1" /> Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="glass-card border-accent-glow">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Empresa:</span><p className="font-medium">{selectedRequest.company_name}</p></div>
                <div><span className="text-muted-foreground">Contato:</span><p className="font-medium">{selectedRequest.contact_name}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selectedRequest.email}</p></div>
                <div><span className="text-muted-foreground">Telefone:</span><p className="font-medium">{selectedRequest.phone}</p></div>
                <div><span className="text-muted-foreground">Tipo:</span><p className="font-medium">{typeLabels[selectedRequest.partnership_type]}</p></div>
                <div><span className="text-muted-foreground">Data:</span><p className="font-medium">{new Date(selectedRequest.created_at).toLocaleDateString('pt-BR')}</p></div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Mensagem:</span>
                <p className="mt-1 p-3 bg-secondary rounded-lg text-sm">{selectedRequest.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnershipManagement;
