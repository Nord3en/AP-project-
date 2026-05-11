using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Calendar.Models;
[Table("Task")]
public partial class CalendarTask
{
    public int Id { get; set; }

    public int UserId { get; set; }
    
[JsonPropertyName("subid")]
    public int? Subid { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public bool? IsCompleted { get; set; }

    public string? Source { get; set; }

    public virtual Subject? Sub { get; set; }

[JsonIgnore] 
public virtual User? User { get; set; }
}
