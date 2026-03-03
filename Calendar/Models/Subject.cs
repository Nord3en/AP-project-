using System;
using System.Collections.Generic;

namespace Calendar.Models;

public partial class Subject
{
    public int Subid { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string? ColorCode { get; set; }

    public string? TeacherEmail { get; set; }

    public string? GroupNumber { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual User User { get; set; } = null!;
}
