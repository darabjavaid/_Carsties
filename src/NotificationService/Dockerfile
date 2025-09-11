FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy Zscaler PEM certificates
COPY ZscalerRootCA.pem /usr/local/share/ca-certificates/ZscalerRootCA.crt

# Update CA store in Linux container
RUN update-ca-certificates

COPY Carsties.sln ./
COPY src/NotificationService/NotificationService.csproj ./src/NotificationService/
COPY src/Contracts/Contracts.csproj ./src/Contracts/

RUN dotnet restore ./src/NotificationService/NotificationService.csproj

COPY . .
RUN dotnet publish ./src/NotificationService/NotificationService.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.dll"]