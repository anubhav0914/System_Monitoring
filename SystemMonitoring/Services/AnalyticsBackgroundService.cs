using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;


public class AnalyticsBackgroundService : BackgroundService
{
    private readonly string DataFilePath = Path.Combine(AppContext.BaseDirectory, "data.json");
    private readonly List<string> SecurityEvents = new()
    {
        "No threats detected",
        "Suspicious process found: malware.exe",
        "Firewall block: Unauthorized outbound connection",
        "Security scan completed"
    };

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("🔒 PC Protection Service (Background Analytics) started...");

        var prevCpuTime = Process.GetCurrentProcess().TotalProcessorTime;
        var prevTime = DateTime.UtcNow;

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;
            var process = Process.GetCurrentProcess();
            var cpuTime = process.TotalProcessorTime;

            // Approximate CPU usage for this process over interval
            var cpuUsedPercent = ((cpuTime - prevCpuTime).TotalMilliseconds / (Environment.ProcessorCount * (now - prevTime).TotalMilliseconds)) * 100;

            prevCpuTime = cpuTime;
            prevTime = now;

            var memoryUsedGb = process.WorkingSet64 / (1024.0 * 1024 * 1024);

            var entry = new AnalyticsEntry
            {
                Timestamp = now,
                CpuUsedPercent = cpuUsedPercent,
                MemoryUsedGb = memoryUsedGb,
                SecurityEvent = SecurityEvents[new Random().Next(SecurityEvents.Count)]
            };

            await PersistData(entry);

            Console.WriteLine($"📊 {entry.Timestamp}: CPU={entry.CpuUsedPercent:F2}%, Mem={entry.MemoryUsedGb:F2} GB, Event={entry.SecurityEvent}");

            await Task.Delay(15000, stoppingToken); // every 15 seconds
        }
    }

    private async Task PersistData(AnalyticsEntry newEntry)
    {
        var entries = new List<AnalyticsEntry>();

        if (File.Exists(DataFilePath))
        {
            var json = await File.ReadAllTextAsync(DataFilePath);
            entries = JsonSerializer.Deserialize<List<AnalyticsEntry>>(json) ?? new List<AnalyticsEntry>();
        }

        entries.Add(newEntry);

        if (entries.Count > 100)
            entries = entries.Skip(entries.Count - 100).ToList();

        var newJson = JsonSerializer.Serialize(entries, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(DataFilePath, newJson);
    }
}
