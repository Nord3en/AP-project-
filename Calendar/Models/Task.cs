using System;
using System.Collections.Generic;

namespace Calendar.Models;

public partial class Task
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? Subid { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public bool? IsCompleted { get; set; }

    public string? Source { get; set; }

    public virtual Subject? Sub { get; set; }

    public virtual User User { get; set; } = null!;
}
