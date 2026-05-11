using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace Calendar.Models;

public partial class Subject
{
    public int Subid { get; set; }
[JsonIgnore]
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string? ColorCode { get; set; }

    public string? TeacherEmail { get; set; }

    public string? GroupNumber { get; set; }

    public virtual ICollection<CalendarTask> CalendarTask { get; set; } = new List<CalendarTask>();
[JsonIgnore]
    public virtual User? User { get; set; } = null!;
}
