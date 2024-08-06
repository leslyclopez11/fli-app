public class Profile {
    private String name;
    private String pronouns;
    private String classyear;
    private String username;
    private String password;

    public Profile(String name, String pronouns, String classyear, String username, String password) {
        this.name = name;
        this.pronouns = pronouns;
        this.classyear = classyear;
        this.username = username;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public String getPronouns() {
        return pronouns;
    }

    public String getClassYear() {
        return classyear;
    }

    public String getUserName() {
        return username;
    }
    
    public String getPassword() {
        return password;
    }

}