import React from "react";
import { ServiceHealthStatus } from "@/types/telemetry";
import { Card } from "../ui/Card";
import { Database, Cpu, Radio, Server } from "lucide-react";

interface ServiceHealthCardsProps {
  services: ServiceHealthStatus[];
}

export function ServiceHealthCards({ services }: ServiceHealthCardsProps) {
  const getIcon = (name: string) => {
    if (name.includes("PostgreSQL")) return <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
    if (name.includes("Debezium")) return <Cpu className="h-4 w-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />;
    if (name.includes("Kafka")) return <Radio className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />;
    return <Server className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />;
  };

  return (
    <section aria-label="Cluster Services Health" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      {services.map((svc) => (
        <Card key={svc.serviceName} role="region" ariaLabel={`${svc.serviceName} Status`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(svc.serviceName)}
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">{svc.serviceName}</h4>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
              {svc.status}
            </span>
          </div>

          <div className="mt-3 text-lg font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{svc.uptime}</div>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-zinc-400">{svc.details}</p>
        </Card>
      ))}
    </section>
  );
}
