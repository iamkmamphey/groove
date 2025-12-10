using System;

namespace Shared.Models
{
    public class InstrumentDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int DefaultBpm { get; set; } = 120;
        public string? AudioUrl { get; set; }
        public int PageIndex { get; set; } = 0;
        public int OrderOnPage { get; set; } = 0;
        public double DefaultVolume { get; set; } = 0.9;
        public bool IsMetronome { get; set; } = false;
        public string? WaveformImageUrl { get; set; }
    }
}
