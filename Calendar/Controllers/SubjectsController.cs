using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Calendar.Models;
using Microsoft.AspNetCore.Authorization; 
using System.Security.Claims;

namespace Calendar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly DataContext _context;

        public SubjectsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Subjects
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
    
        {

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userIdString))
    {
        return Unauthorized();
    }

    int currentUserId = int.Parse(userIdString);
    return await _context.Subjects
        .Where(s => s.UserId == currentUserId)
        .ToListAsync();

            
        }

        // GET: api/Subjects/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Subject>> GetSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
            {
                return NotFound();
            }

            return subject;
        }

        // PUT: api/Subjects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
[Authorize]
public async Task<IActionResult> PutSubject(int id, Subject subject)
{
    if (id != subject.Subid)
    {
        return BadRequest("ID mismatch");
    }
    var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
    int currentUserId = int.Parse(userIdString);
    var dbSubject = await _context.Subjects
        .FirstOrDefaultAsync(s => s.Subid == id && s.UserId == currentUserId);
    if (dbSubject == null)
    {
        return NotFound("Category not found or you do not have permission to edit it.");
    }
    dbSubject.Name = subject.Name;
    dbSubject.ColorCode = subject.ColorCode; 
    dbSubject.TeacherEmail = subject.TeacherEmail;
    dbSubject.GroupNumber = subject.GroupNumber;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!SubjectExists(id)) return NotFound();
        else throw;
    }

    return NoContent();
}
        // POST: api/Subjects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
public async Task<ActionResult<Subject>> PostSubject(Subject subject)
{
    var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
    
    if (string.IsNullOrEmpty(userIdString))
    {
        return Unauthorized("You must be logged in to create a subject.");
    }

    subject.UserId = int.Parse(userIdString);
    Console.WriteLine($"\n\n---> EXTRACTED USER ID FROM COOKIE: {userIdString} <--- \n\n");
    _context.Subjects.Add(subject);
    await _context.SaveChangesAsync();

    return CreatedAtAction("GetSubject", new { id = subject.Subid }, subject);
}

        // DELETE: api/Subjects/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSubject(int id)
{
    var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
    int currentUserId = int.Parse(userIdString);

    var subject = await _context.Subjects
        .FirstOrDefaultAsync(s => s.Subid == id && s.UserId == currentUserId);

    if (subject == null)
    {
        return NotFound();
    }

    _context.Subjects.Remove(subject);
    await _context.SaveChangesAsync();

    return NoContent();
}
        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.Subid == id);
        }
    }
}
