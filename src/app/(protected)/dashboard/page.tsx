import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiBatteryCharging, FiTrendingDown, FiZap } from "react-icons/fi";

const stats = [
  {
    title: "Total Consumption",
    value: "1,248 kWh",
    icon: FiZap,
  },
  {
    title: "Energy Saved",
    value: "18.4%",
    icon: FiTrendingDown,
  },
  {
    title: "Active Devices",
    value: "24",
    icon: FiBatteryCharging,
  },
];

export default function DashboardPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Energy Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor energy usage, savings, and device performance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Energy Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              Chart area for energy usage
            </div>
          </CardContent>
        </Card>
      </div>
  );
}