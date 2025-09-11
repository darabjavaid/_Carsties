using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false; // Set to true in production
        options.TokenValidationParameters.ValidateAudience = false; // Disable audience validation
        options.TokenValidationParameters.NameClaimType = "username"; // Use 'username' as the name claim type
    });

//for notification service, add cors, as it will directly connect with client app

builder.Services.AddCors(options =>
{
    options.AddPolicy("customPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration["ClientApp"]) // Replace with your client app URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Allow credentials for SignalR
    });
});

var app = builder.Build();

app.UseCors();

app.MapReverseProxy();

app.UseAuthentication();
app.UseAuthorization(); 

app.Run();
