import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  danger: XCircle,
};

export default function ActivityList({ data }: { data: any[] }) {
  return (
    <div className="rounded-xl border bg-background p-4 space-y-3">
      {data.map((a, i) => {
        const Icon = icons[a.type as keyof typeof icons] || Info;

        return (
          <div key={i} className="flex gap-3 text-sm">
            <Icon size={16} />
            <div>
              <p>{a.text}</p>
              <p className="text-xs text-muted-foreground">
                {a.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}