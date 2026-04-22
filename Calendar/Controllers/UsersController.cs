using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Calendar.Models;

namespace Calendar.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Uid)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Uid }, user);
        }

// POST: api/Users/register
[HttpPost("register")]
public async Task<ActionResult<User>> Register(AuthRequest request)
{
    // 1. Check if a user with this email already exists
    if (await _context.Users.AnyAsync(u => u.Email == request.Email))
    {
        return BadRequest("A user with this email already exists.");
    }

    // 2. Hash the password using BCrypt
    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Passhash);

    // 3. Create the new User object to save in the database
    var newUser = new User
    {
        Email = request.Email,
        Name = request.Name,
        // Save the HASHED password to your database, not the plain text one!
        // (Assuming your database model uses the property name 'Passhash')
        Passhash = hashedPassword 
    };

    // 4. Save to database
    _context.Users.Add(newUser);
    await _context.SaveChangesAsync();

    return Ok(newUser);
}

// POST: api/Users/login
[HttpPost("login")]
public async Task<ActionResult<User>> Login(AuthRequest request)
{
    // 1. Look for the user by their email
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    
    // If the user isn't found in the database
    if (user == null)
    {
        return BadRequest("User not found.");
    }

    // 2. Compare the typed password with the hashed password in the database
    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Passhash, user.Passhash);
    
    // If they don't match
    if (!isPasswordValid)
    {
        return BadRequest("Wrong password.");
    }

    // 3. If everything is correct, log them in!
    return Ok(user);
}
        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Uid == id);
        }
    }

    public class AuthRequest
  {
    public string Email { get; set; }
    public string Passhash { get; set; } // This is the plain password from Angular
    public string Name { get; set; }
  }
}
