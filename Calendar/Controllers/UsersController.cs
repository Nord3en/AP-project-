using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Calendar.Models;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization; 

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

// GET: api/Users/me
[HttpGet("me")]
[Authorize]
public async Task<ActionResult<object>> GetMe()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var user = await _context.Users.FindAsync(userId);

    if (user == null) return NotFound();
    return Ok(new { name = user.Name, email = user.Email });
}

// PUT: api/Users/me
[HttpPut("me")]
[Authorize]
public async Task<IActionResult> UpdateMe(UpdateProfileRequest request)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var user = await _context.Users.FindAsync(userId);

    if (user == null) return NotFound();

    // Update Name and Email
    user.Name = request.Name;
    user.Email = request.Email;

    // Only update password if a new one was actually provided
    if (!string.IsNullOrEmpty(request.Password))
    {
        user.Passhash = BCrypt.Net.BCrypt.HashPassword(request.Password);
    }

    _context.Entry(user).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent();
}

// DELETE: api/Users/me
[HttpDelete("me")]
[Authorize]
public async Task<IActionResult> DeleteMe()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
    var user = await _context.Users.FindAsync(userId);

    if (user == null) return NotFound();

    // 1. Remove from Database
    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    // 2. Kick them out (clear the cookie)
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    return Ok(new { message = "Account deleted and logged out." });
}

public class UpdateProfileRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Password { get; set; }
}


        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Uid) return BadRequest();
            _context.Entry(user).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.Uid }, user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("A user with this email already exists.");
            }
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Passhash);
            var newUser = new User
            {
                Email = request.Email,
                Name = request.Name,
                Passhash = hashedPassword 
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return Ok(newUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return BadRequest("User not found.");

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Passhash, user.Passhash);
            if (!isPasswordValid) return BadRequest("Wrong password.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Uid.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);    

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, 
                new ClaimsPrincipal(claimsIdentity)
            );

            return Ok(new { message = "Logged in successfully", user = new { user.Uid, user.Name, user.Email } });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Uid == id);
        }
        [HttpGet("auth-status")]
        [Authorize] 
        public IActionResult CheckAuthStatus()
        {
            return Ok(new { isAuthenticated = true });
        }
    } 
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Passhash { get; set; }
        public string Name { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Passhash { get; set; }
    }
}