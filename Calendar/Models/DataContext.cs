using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Calendar.Models;

public partial class DataContext : DbContext
{
    public DataContext()
    {
    }

    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Database=Data;Username=postgres;Password=asd123");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Subid).HasName("subjects_pkey");

            entity.ToTable("subjects");

            entity.Property(e => e.Subid)
                .UseIdentityAlwaysColumn()
                .HasColumnName("subid");
            entity.Property(e => e.ColorCode)
                .HasMaxLength(7)
                .HasColumnName("color_code");
            entity.Property(e => e.GroupNumber)
                .HasMaxLength(50)
                .HasColumnName("group_number");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.TeacherEmail)
                .HasMaxLength(255)
                .HasColumnName("teacher_email");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_subject");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tasks_pkey");

            entity.ToTable("tasks");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.IsCompleted)
                .HasDefaultValue(false)
                .HasColumnName("is_completed");
            entity.Property(e => e.Source)
                .HasMaxLength(100)
                .HasColumnName("source");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.Subid).HasColumnName("subid");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Sub).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.Subid)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_subject_task");

            entity.HasOne(d => d.User).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_task");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Uid).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.Uid)
                .UseIdentityAlwaysColumn()
                .HasColumnName("uid");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Passhash)
                .HasMaxLength(255)
                .HasColumnName("passhash");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
