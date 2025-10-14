import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  title: string;
}

export const MapDialog = ({ open, onClose, lat, lng, title }: MapDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[450px]">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
