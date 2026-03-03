using System;
using System.Collections.Generic;

namespace Calendar.Models;

public partial class User
{
    public int Uid { get; set; }

    public string Email { get; set; } = null!;

    public string Passhash { get; set; } = null!;

    public string? Name { get; set; }

    public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
